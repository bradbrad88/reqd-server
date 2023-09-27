import client from "../../../config/db";
import {
  createNewProductLocationInteractor,
  createVenueAreaInteractor,
  removeProductLocationInteractor,
  setProductLocationParLevelInteractor,
} from "./venueAreaInteractor";
import type { VenueAreaJson } from "./VenueArea";

export const getVenueAreaDB = async (areaId: string) => {
  const res = await client.venueArea.findUniqueOrThrow({
    where: { id: areaId },
    include: {
      ProductLocations: {
        select: { id: true, product: true, parLevel: true, sortedOrder: true },
      },
    },
  });
  const products = res.ProductLocations.map(({ id, parLevel, product, sortedOrder }) => ({
    id: id,
    productId: product.id,
    parLevel: parLevel,
    sortedOrder: sortedOrder,
    displayName: product.displayName,
    unitType: product.unitType,
    packageType: product.packageType,
    packageQuantity: product.packageQuantity,
    size: product.size,
    unitOfMeasurement: product.unitOfMeasurement,
  }));
  products.sort((a, b) => a.sortedOrder - b.sortedOrder);
  return {
    id: res.id,
    areaName: res.areaName,
    products,
  };
};

export const getVenueAreasDB = async (venueId: string) => {
  const res = await client.venueArea.findMany({
    where: { venueId },
    select: { id: true, areaName: true, ProductLocations: { select: { id: true } } },
  });
  return res.map(area => ({
    id: area.id,
    areaName: area.areaName,
    productLocations: area.ProductLocations,
  }));
};

export const createVenueAreaDB = async (venueAreaData: VenueAreaJson) => {
  const { productLocations, ...venueArea } = createVenueAreaInteractor(venueAreaData);
  console.log(venueArea);
  const savedClient = await client.venueArea.create({ data: venueArea });
  return savedClient;
};

export const deleteVenueAreaDB = async ({
  venueId,
  areaId,
}: {
  venueId: string;
  areaId: string;
}) => {
  await client.venueArea.delete({ where: { id: areaId, venueId } });
};

export const getVenueAreaProductsDB = async (areaId: string) => {
  const res = await client.venueArea.findUniqueOrThrow({
    where: { id: areaId },
    include: {
      ProductLocations: {
        include: { product: { select: { displayName: true } } },
      },
    },
  });
  const locations = res.ProductLocations.map(location => ({
    productId: location.productId,
    parLevel: location.parLevel,
    displayName: location.product.displayName,
  }));
  return locations;
};

export const addProductToVenueAreaDB = async ({
  areaId,
  productId,
  sortedOrder,
  parLevel,
}: {
  areaId: string;
  productId: string;
  sortedOrder?: number;
  parLevel?: number;
}) => {
  const venueArea = await client.venueArea.findUniqueOrThrow({
    where: { id: areaId },
    include: { ProductLocations: true },
  });
  const productLocations = createNewProductLocationInteractor(
    { ...venueArea, productLocations: venueArea.ProductLocations },
    { parLevel: parLevel || null, sortedOrder, productId }
  );

  const res = await client.productLocations.createMany({
    data: productLocations.newLocations,
  });
};

export const removeProductFromVenueAreaDB = async (
  productLocationId: string,
  areaId: string
) => {
  const area = await client.venueArea.findUniqueOrThrow({
    where: { id: areaId },
    include: { ProductLocations: true },
  });
  const venueArea = { ...area, productLocations: area.ProductLocations };

  const updatedProducts = removeProductLocationInteractor(productLocationId, venueArea);

  await Promise.all(
    updatedProducts.map(
      async prod =>
        await client.productLocations.update({
          where: { id: prod.id },
          data: { sortedOrder: prod.sortedOrder },
        })
    )
  );

  await client.productLocations.delete({
    where: { id: productLocationId },
  });
};

export const setProductLocationParLevelDB = async (
  productLocationId: string,
  parLevel: number | null,
  venueAreaId: string
) => {
  const res = await client.venueArea.findUniqueOrThrow({
    where: { id: venueAreaId },
    include: { ProductLocations: true },
  });
  const venueArea = { ...res, productLocations: res.ProductLocations };
  const productLocation = setProductLocationParLevelInteractor(
    productLocationId,
    parLevel,
    venueArea
  );
  return await client.productLocations.update({
    where: { id: productLocationId },
    data: { parLevel: productLocation.parLevel },
  });
};
