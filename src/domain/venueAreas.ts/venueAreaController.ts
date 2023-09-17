import { z } from "zod";
import { Controller } from "../../types/IController";
import {
  addProductToVenueAreaDB,
  createVenueAreaDB,
  deleteVenueAreaDB,
  getVenueAreaDB,
  getVenueAreaProductsDB,
  getVenueAreasDB,
  removeProductFromVenueAreaDB,
  setProductLocationParLevelDB,
} from "./venueAreaPersistence";

export const createVenueAreaController: Controller = async req => {
  const bodySchema = z.object({
    areaName: z.string(),
  });
  const paramsSchema = z.object({
    venueId: z.string(),
  });
  const validatedBody = bodySchema.parse(req.body);
  const validatedParams = paramsSchema.parse(req.params);

  return await createVenueAreaDB({ ...validatedBody, ...validatedParams });
};

export const getVenueAreaController: Controller = async req => {
  const schema = z.object({ venueId: z.string(), areaId: z.string() });
  const { areaId } = schema.parse(req.params);
  return await getVenueAreaDB(areaId);
};

export const getVenueAreasController: Controller = async req => {
  const schema = z.object({ venueId: z.string() });
  const data = schema.parse(req.params);
  return await getVenueAreasDB(data.venueId);
};

export const deleteVenueAreaController: Controller = async req => {
  const schema = z.object({ venueId: z.string(), areaId: z.string() });

  const { areaId, venueId } = schema.parse(req.params);
  await deleteVenueAreaDB({ venueId, areaId });
};

export const getVenueAreaProductsController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string(), areaId: z.string() });
  const { areaId } = paramsSchema.parse(req.params);
  return await getVenueAreaProductsDB(areaId);
};

export const addProductToVenueAreaController: Controller = async req => {
  const bodySchema = z.object({
    productId: z.string(),
    parLevel: z.number().optional(),
    sortedOrder: z.number().optional(),
  });
  const paramsSchema = z.object({ venueId: z.string(), areaId: z.string() });
  const { productId, parLevel, sortedOrder } = bodySchema.parse(req.body);
  const { venueId, areaId } = paramsSchema.parse(req.params);
  await addProductToVenueAreaDB({ areaId, productId, parLevel, sortedOrder });
};

export const removeProductFromAreaController: Controller = async req => {
  const paramsSchema = z.object({ areaId: z.string(), productLocation: z.string() });
  const { productLocation, areaId } = paramsSchema.parse(req.params);
  await removeProductFromVenueAreaDB(productLocation, areaId);
};

export const setProductLocationParLevelController: Controller = async req => {
  const paramsSchema = z.object({ areaId: z.string(), productLocation: z.string() });
  const bodySchema = z.object({ parLevel: z.number().nullable() });
  const { areaId, productLocation } = paramsSchema.parse(req.params);
  const { parLevel } = bodySchema.parse(req.body);
  return await setProductLocationParLevelDB(productLocation, parLevel, areaId);
};
