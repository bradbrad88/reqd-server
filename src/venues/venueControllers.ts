import type { Controller } from "../types/IController";
import { getVenuePersistence } from "./venuePersistence";
import { z } from "zod";

export const getVenueController: Controller = async httpRequest => {
  const schema = z.object({ venueId: z.string() });
  const { venueId } = schema.parse(httpRequest.params);
  const venue = await getVenuePersistence(venueId);
  return venue;
};
