import client from "../../config/db";
import { createVenueInteractor } from "../domain/venueInteractor";

export const getVenuePersistence = async (venue: string) => {
  const foundVenue = await client.venue.findFirst({ where: { id: venue } });
  return foundVenue;
};

export const createVenuePersistence = async (venueName: string) => {
  const venue = createVenueInteractor(venueName);
  await client.venue.create({ data: { venueName: venue.venueName } });
};
