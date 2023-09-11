import VenueArea from "./VenueArea";
import type { VenueAreaJson } from "./VenueArea";

export const createVenueAreaInteractor = (venueAreaData: VenueAreaJson) => {
  const venueArea = new VenueArea(venueAreaData);
  return venueArea.toJson();
};

export const updateVenueAreaNameInteractor = (
  venueAreaData: VenueAreaJson,
  newName: string
) => {
  const venueArea = new VenueArea(venueAreaData);
  venueArea.areaName = newName;
  return venueArea.toJson();
};
