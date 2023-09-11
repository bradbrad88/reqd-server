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
  const { areaId, venueId } = schema.parse(req.params);
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
  const bodySchema = z.object({ productId: z.string(), parLevel: z.number().optional() });
  const paramsSchema = z.object({ venueId: z.string(), areaId: z.string() });
  const { productId, parLevel } = bodySchema.parse(req.body);
  const { areaId } = paramsSchema.parse(req.params);
  await addProductToVenueAreaDB({ areaId, productId, parLevel });
};

export const removeProductFromAreaController: Controller = async req => {
  const bodySchema = z.object({ productId: z.string() });
  const paramsSchema = z.object({ venueId: z.string(), areaId: z.string() });
  const { productId } = bodySchema.parse(req.body);
  const { areaId } = paramsSchema.parse(req.params);
  await removeProductFromVenueAreaDB({ areaId, productId });
};
