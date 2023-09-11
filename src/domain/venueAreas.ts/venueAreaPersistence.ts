import client from "../../../config/db";
import { createVenueAreaInteractor } from "./venueAreaInteractor";
import type { VenueAreaJson } from "./VenueArea";

export const getVenueAreaDB = async (areaId: string) => {
  const res = await client.venueArea.findUniqueOrThrow({
    where: { id: areaId },
    include: { ProductLocations: { select: { product: true } } },
  });

  return {
    id: res.id,
    areaName: res.areaName,
    products: res.ProductLocations.map(location => ({ ...location.product })),
  };
};

export const getVenueAreasDB = async (venueId: string) => {
  return await client.venueArea.findMany({
    where: { venueId },
    select: { id: true, areaName: true },
  });
};

export const createVenueAreaDB = async (venueAreaData: VenueAreaJson) => {
  const venueArea = createVenueAreaInteractor(venueAreaData);
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

export const addProductToVenueAreaDB = async (data: {
  areaId: string;
  productId: string;
  parLevel?: number;
}) => {
  const res = await client.productLocations.create({ data });
  return res;
};

export const removeProductFromVenueAreaDB = async ({
  areaId,
  productId,
}: {
  areaId: string;
  productId: string;
}) => {
  const res = await client.productLocations.delete({
    where: { productId_areaId: { areaId, productId } },
  });
};
