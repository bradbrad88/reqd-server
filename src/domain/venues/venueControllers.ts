import type { Controller } from "../../types/IController";
import {
  createVenueDB,
  deleteVenueDB,
  getVenueDB,
  updateVenueNameDB,
} from "./venuePersistence";
import { z } from "zod";

export const getVenueController: Controller = async httpRequest => {
  const schema = z.object({ venueId: z.string() });
  const { venueId } = schema.parse(httpRequest.params);
  const venue = await getVenueDB(venueId);
  return venue;
};

export const createVenueController: Controller = async httpRequest => {
  const schema = z.object({
    venueName: z.string(),
  });
  const { venueName } = schema.parse(httpRequest.body);
  const venue = await createVenueDB(venueName);
  return venue;
};

export const updateVenueNameController: Controller = async httpRequest => {
  const bodySchema = z.object({
    venueName: z.string(),
  });
  const paramsSchema = z.object({
    venueId: z.string(),
  });
  const { venueName } = bodySchema.parse(httpRequest.body);
  const { venueId } = paramsSchema.parse(httpRequest.params);
  const venue = await updateVenueNameDB(venueId, venueName);
  return venue;
};

export const deleteVenueController: Controller = async httpRequest => {
  const schema = z.object({ venueId: z.string() });
  const { venueId } = schema.parse(httpRequest.params);
  return await deleteVenueDB(venueId);
};
