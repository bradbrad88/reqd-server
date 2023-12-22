import client from "../../../config/db";

type Filters = {
  vendorId?: string[];
  areaId?: string[];
  query?: string;
  venueId?: string;
};

export const getProductById = async (id: string) => {
  const product = await client.product.findUniqueOrThrow({
    where: { id },
    include: { unitType: true, unitOfMeasurement: true },
  });
  const unitType = {
    value: product.unitType.value,
    plural: product.unitType.plural || product.unitType.value + "s",
  };
  const unitOfMeasurement = { value: product.unitOfMeasurement?.value };
  return {
    id: product.id,
    displayName: product.displayName,
    venueId: product.venueId,
    unitType,
    size: product.size,
    unitOfMeasurement,
  };
};

export const getGlobalProducts = async (filters: Filters, page: number, pageSize: number) => {
  const prismaFilters = {
    displayName: { contains: filters.query || "", mode: "insensitive" },
  } as const;
  const [count, res] = await Promise.all([
    client.product.count({ where: prismaFilters }),
    client.product.findMany({
      where: prismaFilters,
      include: { unitType: true, unitOfMeasurement: true, Inventory: true },
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
  ]);
  const inventory = new Set(
    (
      await client.inventory.findMany({
        where: { productId: { in: res.map(product => product.id) } },
      })
    ).map(item => item.productId)
  );
  const products = res.map(product => ({
    id: product.id,
    displayName: product.displayName,
    size: product.size,
    unitType: product.unitType,
    unitOfMeasurement: product.unitOfMeasurement,
    inInventory: inventory.has(product.id),
  }));
  return { products, count, page, pageSize };
};
