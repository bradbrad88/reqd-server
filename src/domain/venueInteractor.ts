import Venue from "./Venue";

export const createVenueInteractor = (venueName: string): Venue => {
  const venue = new Venue(venueName);
  return venue;
};
