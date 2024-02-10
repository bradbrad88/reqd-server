import client from "../../../config/db";

type GlobalProductFilters = {
  vendorId?: string[];
  areaId?: string[];
  query?: string;
  venueId?: string;
};

export const getVenueInventory = async (venueId: string, query?: string) => {
  const AND = [{ venueId }] as any[];
  if (query != null)
    AND.push({ product: { displayName: { contains: query, mode: "insensitive" } } });
  const where = { AND };
  const res = await client.inventory.findMany({
    where,
    include: {
      product: { include: { unitType: true, unitOfMeasurement: true } },
      defaultVendorProduct: { include: { vendor: true } },
    },
  });
  return res.map(
    ({
      product: { displayName, id, size, unitOfMeasurement, unitType },
      defaultVendorProduct,
    }) => ({
      productId: id,
      displayName,
      size,
      unitOfMeasurement,
      unitType,
      defaultSupply: defaultVendorProduct,
    })
  );
};

export const getVenueInventoryItem = async (venueId: string, productId: string) => {
  const { displayName, size, unitOfMeasurement, unitType, inventory } =
    await client.product.findUniqueOrThrow({
      where: { id: productId },
      include: {
        unitOfMeasurement: true,
        unitType: true,
        inventory: {
          where: { venueId },
          include: { defaultVendorProduct: { include: { packageType: true, vendor: true } } },
        },
      },
    });
  const inventoryItem = inventory[0];
  const defaultSupply = inventoryItem ? inventoryItem.defaultVendorProduct : null;
  const vendor = defaultSupply ? defaultSupply.vendor : null;
  const packageType = defaultSupply ? defaultSupply.packageType : null;

  return {
    productId,
    displayName,
    size,
    unitOfMeasurement,
    unitType,
    defaultSupply,
    isInInventory: !!inventoryItem,
    vendor,
    packageType,
  };
};

export const getProductVendorOptions = async (venueId: string, productId: string) => {
  const res = await client.vendorRange.findMany({
    where: { productId, vendor: { is: { preferredVendor: { some: { venueId } } } } },
    include: { vendor: true, packageType: true },
  });
  return res.map(({ id, vendor, packageType, packageQuantity }) => ({
    vendorRangeId: id,
    packageType,
    packageQuantity,
    vendor,
  }));
};

export const getGlobalProducts = async (
  venueId: string,
  filters: GlobalProductFilters,
  page: number,
  pageSize: number
) => {
  const prismaFilters = {
    displayName: { contains: filters.query || "", mode: "insensitive" },
  } as const;
  const [count, res] = await Promise.all([
    client.product.count({ where: prismaFilters }),
    client.product.findMany({
      where: prismaFilters,
      include: { unitType: true, unitOfMeasurement: true, inventory: true },
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
  ]);

  const inventory = await client.inventory.findMany({
    where: { AND: [{ productId: { in: res.map(product => product.id) } }, { venueId }] },
    include: { defaultVendorProduct: { include: { packageType: true } } },
  });

  const inventoryMap = inventory.reduce((map, product) => {
    map.set(product.productId, product);

    return map;
  }, new Map<string, (typeof inventory)[number]>());

  const products = res.map(product => ({
    productId: product.id,
    displayName: product.displayName,
    size: product.size,
    unitType: product.unitType,
    unitOfMeasurement: product.unitOfMeasurement,
    inInventory: inventoryMap.has(product.id),
  }));
  return { products, count, page, pageSize };
};
