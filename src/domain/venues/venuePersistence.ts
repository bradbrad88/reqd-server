import client from "../../../config/db";
import { createVenueInteractor, updateVenueInteractor } from "./venueInteractor";

export const getVenueDB = async (venue: string) => {
  const foundVenue = await client.venue.findFirstOrThrow({ where: { id: venue } });
  return foundVenue;
};

export const createVenueDB = async (venueName: string) => {
  const venue = createVenueInteractor(venueName);
  const createdVenue = await client.venue.create({ data: { venueName: venue.venueName } });
  return createdVenue;
};

export const updateVenueNameDB = async (venueId: string, venueName: string) => {
  const venue = await getVenueDB(venueId);
  const updatedVenue = updateVenueInteractor(venue, venueName);
  const savedVenue = await client.venue.update({
    data: { venueName: updatedVenue.venueName },
    where: { id: venueId },
  });
  return savedVenue;
};

export const deleteVenueDB = async (venueId: string) => {
  await client.venue.delete({ where: { id: venueId } });
};
