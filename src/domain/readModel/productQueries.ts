import client from "../../../config/db";

type Filters = {
  vendorId?: string[];
  areaId?: string[];
  query?: string;
};

export const getProductById = async (id: string) => {
  const product = await client.product.findUniqueOrThrow({
    where: { id },
    include: { UnitType: true, PackageType: true, UnitOfMeasurement: true, vendor: true },
  });
  const unitType = {
    value: product.UnitType.value,
    plural: product.UnitType.plural || product.UnitType.value + "s",
  };
  const packageType = {
    value: product.PackageType.value,
    plural: product.PackageType.plural || product.PackageType.value + "s",
  };
  const unitOfMeasurement = { value: product.UnitOfMeasurement?.value };
  return {
    id: product.id,
    displayName: product.displayName,
    venueId: product.venueId,
    vendorId: product.vendorId,
    vendorName: product.vendor?.vendorName,
    unitType,
    packageType,
    packageQuantity: product.packageQuantity,
    size: product.size,
    unitOfMeasurement,
  };
};

export const getVenueProducts = async (venueId: string, filters: Filters) => {
  const prismaFilters = [{ venueId }] as any[];

  if (filters?.areaId) {
    prismaFilters.push({
      OR: filters.areaId.map(areaId => ({ ProductLocations: { some: { areaId } } })),
    });
  }

  if (filters?.vendorId) {
    prismaFilters.push({
      OR: filters.vendorId.map(vendorId => ({ vendorId })),
    });
  }

  if (filters?.query) {
    prismaFilters.push({
      displayName: { contains: filters.query, mode: "insensitive" },
    });
  }

  const foundProducts = await client.product.findMany({
    where: {
      AND: prismaFilters,
    },
    select: {
      id: true,
      displayName: true,
      UnitType: true,
      PackageType: true,
      packageQuantity: true,
      size: true,
      UnitOfMeasurement: true,
      vendor: { select: { vendorName: true, id: true } },
    },
  });
  const returnProducts = foundProducts.map(product => ({
    id: product.id,
    vendorId: product.vendor?.id,
    vendorName: product.vendor?.vendorName,
    displayName: product.displayName,
    unitType: product.UnitType,
    packageType: product.PackageType,
    packageQuantity: product.packageQuantity,
    size: product.size,
    unitOfMeasurement: product.UnitOfMeasurement,
  }));
  return returnProducts;
};
