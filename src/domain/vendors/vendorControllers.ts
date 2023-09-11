import { z } from "zod";
import type { Controller } from "../../types/IController";
import {
  createVendorDB,
  deleteVendorDB,
  getVendorDB,
  getVenueVendorsDB,
} from "./vendorPersistence";

export const createVendorController: Controller = async httpRequest => {
  const bodySchema = z.object({
    vendorName: z.string(),
  });
  const paramsSchema = z.object({
    venueId: z.string(),
  });

  const validatedBody = bodySchema.parse(httpRequest.body);
  const validatedParams = paramsSchema.parse(httpRequest.params);

  const vendor = await createVendorDB({ ...validatedBody, ...validatedParams });
  return vendor;
};

export const getVendorsListController: Controller = async req => {
  const paramsSchema = z.object({
    venueId: z.string(),
  });
  const { venueId } = paramsSchema.parse(req.params);
  const vendors = await getVenueVendorsDB({ venueId });
  return vendors;
};

export const getVendorDetailController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string(), vendorId: z.string() });
  const { vendorId, venueId } = paramsSchema.parse(req.params);
  const vendor = getVendorDB(vendorId);
  return vendor;
};

export const deleteVendorController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string(), vendorId: z.string() });
  const { vendorId, venueId } = paramsSchema.parse(req.params);
  await deleteVendorDB(vendorId);
};
