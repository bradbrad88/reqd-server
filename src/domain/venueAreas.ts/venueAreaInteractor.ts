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

export const createNewProductLocationInteractor = (
  venueArea: VenueAreaJson,
  {
    productId,
    parLevel,
    sortedOrder,
  }: { productId: string; parLevel: number | null; sortedOrder?: number }
) => {
  const area = new VenueArea(venueArea);
  area.addProductLocation({ productId, parLevel, sortedOrder });
  return {
    newLocations: area.getNewProductLocations(),
    updatedLocations: area.getUpdatedProductLocations(),
  };
};

export const removeProductLocationInteractor = (id: string, venueArea: VenueAreaJson) => {
  const area = new VenueArea(venueArea);
  area.removeProductLocation(id);
  return area.getUpdatedProductLocations();
};

export const setProductLocationParLevelInteractor = (
  productLocationId: string,
  parLevel: number | null,
  venueArea: VenueAreaJson
) => {
  const area = new VenueArea(venueArea);
  return area.setParLevel(productLocationId, parLevel);
};
