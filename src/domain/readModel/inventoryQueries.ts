import client from "../../../config/db";

export const getVenueInventory = async (venueId: string) => {
  const res = await client.inventory.findMany({
    where: { venueId },
    include: { product: { include: { unitType: true, unitOfMeasurement: true } } },
  });
  return res.map(({ product: { displayName, id, size, unitOfMeasurement, unitType } }) => ({
    productId: id,
    displayName,
    size,
    unitOfMeasurement,
    unitType,
  }));
};
