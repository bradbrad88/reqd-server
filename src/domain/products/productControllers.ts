import { z } from "zod";
import {
  createProductDB,
  deleteProductDB,
  getProductDB,
  getVenueProductsDB,
  updateProductDetailsDB,
} from "./productPersistence";
import type { Controller } from "../../types/IController";

export const getProductController: Controller = async req => {
  const schema = z.object({ productId: z.string() });
  const data = schema.parse(req.params);
  const product = await getProductDB(data.productId);
  return product;
};

export const getVenueProductsListController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string() });
  const querySchema = z.object({
    vendorId: z.union([z.string(), z.string().array(), z.undefined()]),
    areaId: z.union([z.string(), z.string().array(), z.undefined()]),
    query: z.string().optional(),
  });

  const filters = querySchema.parse(req.query);

  // Make filters object have property values that are Arrays of strings without zero length strings
  const transformedFilters = (Object.keys(filters) as Array<keyof typeof filters>).reduce(
    (obj, key) => {
      const item = filters[key];
      if (typeof item === "undefined") return obj;
      if (typeof item === "string") {
        if (item.length === 0) return obj;
        if (key === "query") {
          obj[key] = item.toLowerCase();
          return obj;
        }
        obj[key] = [item];
        return obj;
      } else {
        const filteredItem = item.filter(str => str.length > 0);
        if (key === "query") return obj;
        obj[key] = filteredItem;
      }
      return obj;
    },
    {} as NonNullable<Parameters<typeof getVenueProductsDB>[1]>
  );

  const { venueId } = paramsSchema.parse(req.params);

  const products = await getVenueProductsDB(venueId, transformedFilters);
  return products;
};

// function transformObjectPropertiesToArrays<
//   T extends { [key: string]: string | number | undefined | string[] | number[] | null }
// >(obj: T) {
//   const keys = Object.keys(obj) as Array<keyof typeof obj>;
//   keys.reduce((accumulator, current) => {}, {} as { [key in ]:  });
// }

export const createProductController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string() });
  const bodyParams = z.object({
    displayName: z.string(),
    vendorId: z.string(),
    size: z.number().optional(),
    measure: z.string().optional(),
  });
  const validatedParams = paramsSchema.parse(req.params);
  const validatedBody = bodyParams.parse(req.body);

  return await createProductDB({ ...validatedParams, ...validatedBody });
};

export const deleteProductController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string(), productId: z.string() });

  const { productId, venueId } = paramsSchema.parse(req.params);
  return await deleteProductDB(productId);
};

export const updateProductDetailsController: Controller = async req => {
  const paramsSchema = z.object({ productId: z.string() });
  const bodySchema = z.object({
    displayName: z.string().optional(),
    size: z.number().optional(),
    measure: z.string().optional(),
  });
  const { productId } = paramsSchema.parse(req.params);
  const details = bodySchema.parse(req.body);
  const product = await updateProductDetailsDB(productId, details);
  return product;
};
