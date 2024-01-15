import { z } from "zod";
import client from "../../../config/db";

export const getVenueAreas = async (venueId: string) => {
  const res = await client.venueArea.findMany({ where: { venueId } });
  return res;
};

export const getVenueAreaById = async (venueAreaId: string) => {
  const res = await client.venueArea.findUniqueOrThrow({ where: { id: venueAreaId } });
  const spotSchema = z.object({
    columnSpan: z.number(),
    parLevel: z.number().nullish(),
    productId: z.string().nullish(),
    product: z.unknown(),
  });
  const schema = z
    .object({
      storageName: z.string(),
      sections: z
        .object({
          shelves: z
            .object({
              spots: spotSchema.array(),
            })
            .array(),
        })
        .array(),
    })
    .array();
  const spaces = schema.parse(res.storageSpaces);
  const spotMap = spaces.reduce((map, space) => {
    space.sections.reduce((map, section) => {
      section.shelves.reduce((map, shelf) => {
        shelf.spots.reduce((map, spot) => {
          if (spot.productId) {
            if (map.has(spot.productId)) {
              const arr = map.get(spot.productId)!;
              arr.push(spot);
            } else {
              map.set(spot.productId, [spot]);
            }
          }
          return map;
        }, map);
        return map;
      }, map);
      return map;
    }, map);
    return map;
  }, new Map<string, z.infer<typeof spotSchema>[]>());
  const products = await client.product.findMany({
    where: { id: { in: Array.from(spotMap.keys()) } },
    select: {
      id: true,
      displayName: true,
      size: true,
      unitOfMeasurement: true,
      unitOfMeasurementId: false,
      unitType: true,
      unitTypeId: false,
    },
  });
  const productMap = products.reduce((map, product) => {
    map.set(product.id, product);
    return map;
  }, new Map<string, { id: string; displayName: string; size: number | null; unitOfMeasurement: { value: string } | null; unitType: { value: string; plural: string | null } }>());
  for (const [productId, spotArr] of spotMap.entries()) {
    const product = productMap.get(productId)!;
    spotArr.forEach(spot => (spot["product"] = product));
  }

  return { ...res, storageSpaces: spaces };
};
