import Venue, { VenueJson } from "./Venue";

export const createVenueInteractor = (venueName: string): Venue => {
  const venue = new Venue({ venueName });
  return venue;
};

export const updateVenueInteractor = (currentVenue: VenueJson, newName: string): Venue => {
  const venue = new Venue(currentVenue);
  venue.renameVenue(newName);
  return venue;
};
