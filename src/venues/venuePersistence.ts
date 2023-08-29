import client from "../../config/db";
import { createVenueInteractor } from "../domain/venueInteractor";

export const getVenueDB = async (venue: string) => {
  const foundVenue = await client.venue.findFirst({ where: { id: venue } });
  return foundVenue;
};

export const createVenueDB = async (venueName: string) => {
  const venue = createVenueInteractor(venueName);
  const createdVenue = await client.venue.create({ data: { venueName: venue.venueName } });
  return createdVenue;
};

export const updateVenueNameDB = async (venueId: string, venueName: string) => {
  const updatedVenue = await client.venue.update({
    data: { venueName },
    where: { id: venueId },
  });
  return updatedVenue;
};

export const deleteVenueDB = async (venueId: string) => {
  await client.venue.delete({ where: { id: venueId } });
};
