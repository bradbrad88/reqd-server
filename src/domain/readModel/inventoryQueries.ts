import client from "../../../config/db";

export const getVenueInventory = async (venueId: string) => {
  const res = await client.inventory.findMany({
    where: { venueId },
    include: { product: { include: { UnitType: true, UnitOfMeasurement: true } } },
  });
  return res.map(item => ({
    productId: item.productId,
    displayName: item.product.displayName,
    size: item.product.size,
    unitOfMeasurement: item.product.UnitOfMeasurement,
    unitType: item.product.UnitType,
  }));
};
