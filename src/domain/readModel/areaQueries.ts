import { z } from "zod";
import client from "../../../config/db";

type SupplyDetails = {
  vendorId: string;
  packageType: { value: string; plural: string };
  packageQuantity: number;
  vendorRangeId: string;
};

export const getVenueAreas = async (venueId: string) => {
  const res = await client.venueArea.findMany({ where: { venueId } });
  return res;
};

export const getVenueAreaById = async (venueAreaId: string) => {
  const res = await client.venueArea.findUniqueOrThrow({ where: { id: venueAreaId } });
  const storageSpaceLayoutSchema = z.string().array();
  const productLineSchema = z.object({
    id: z.string(),
    productId: z.string().nullable(),
    parLevel: z.number().int().gte(0).nullable(),
  });
  const spotSchema = z.object({
    id: z.string(),
    shelfId: z.string(),
    columnWidth: z.number().int().gt(0),
    stackHeight: z.number().int().gt(0),
    productLine: z.string().nullable(),
  });
  const storageSpaceSchema = z.object({
    storageName: z.string(),
    layoutType: z.literal("layout"),
    sectionLayout: z.string().array(),
    sections: z.record(
      z.string(),
      z.object({
        id: z.string(),
        shelfLayout: z.string().array(),
      })
    ),
    shelves: z.record(
      z.string(),
      z.object({
        id: z.string(),
        spotLayout: z.string().array(),
      })
    ),
    spots: z.record(z.string(), spotSchema),
    currentIdSequence: z.number(),
  });

  const storageSpaceMap = z.record(z.string(), storageSpaceSchema);
  const productLines = z.record(z.string(), productLineSchema).parse(res.productLines);
  const productsPresent = Array.from(
    Object.values(productLines).reduce((set, productLine) => {
      if (productLine.productId) set.add(productLine.productId);
      return set;
    }, new Set<string>())
  );

  const storageSpaces = storageSpaceMap.parse(res.storageSpaces);
  const storageSpaceLayout = storageSpaceLayoutSchema.parse(res.storageSpaceLayout);

  const inventory = await client.inventory.findMany({
    where: { venueId: res.venueId, productId: { in: productsPresent } },
    include: { defaultVendorProduct: { include: { packageType: true } } },
  });
  const supplyDetailsMap = new Map<string, SupplyDetails | null>();
  for (const product of inventory) {
    if (!product.defaultVendorProduct) {
      supplyDetailsMap.set(product.productId, null);
    } else {
      const { packageQuantity, packageType, vendorId, id } = product.defaultVendorProduct;
      supplyDetailsMap.set(product.productId, {
        vendorId,
        packageQuantity,
        packageType,
        vendorRangeId: id,
      });
    }
  }
  const productArray = await client.product.findMany({
    where: { id: { in: productsPresent } },
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
  const products = productArray.reduce((map, product) => {
    map[product.id] = {
      ...product,
      defaultSupply: supplyDetailsMap.get(product.id) || null,
    };
    return map;
  }, {} as Record<string, (typeof productArray)[number] & { defaultSupply: SupplyDetails | null }>);
  const qry = { ...res, storageSpaces, storageSpaceLayout, productLines, products };
  return qry;
};
