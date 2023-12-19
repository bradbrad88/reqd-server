import client from "../../../config/db";

export const getVenueAreas = async (venueId: string) => {
  const res = await client.venueArea.findMany({ where: { venueId } });
  return res;
};

export const getVenueAreaById = async (venueAreaId: string) => {
  const res = await client.venueArea.findUniqueOrThrow({ where: { id: venueAreaId } });
  return res;
};
