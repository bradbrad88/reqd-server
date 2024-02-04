import client from "../../../config/db";

export const getVenueInventory = async (venueId: string, query?: string) => {
  const AND = [{ venueId }] as any[];
  if (query != null)
    AND.push({ product: { displayName: { contains: query, mode: "insensitive" } } });
  const where = { AND };
  const res = await client.inventory.findMany({
    where,
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
