import { z } from "zod";
import { getProductById, getVenueProducts } from "../readModel/productQueries";
import Product from "./Product";
import { PostgresProductRepository } from "./PostgresProductRepository";
import type { Controller } from "../../types/IController";

export const getProductController: Controller = async req => {
  const schema = z.object({ productId: z.string() });
  const data = schema.parse(req.params);
  const product = await getProductById(data.productId);
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
    {} as NonNullable<Parameters<typeof getVenueProducts>[1]>
  );

  const { venueId } = paramsSchema.parse(req.params);
  const products = await getVenueProducts(venueId, transformedFilters);
  // const products = await getVenueProductsDB(venueId, transformedFilters);
  return products;
};

export const createProductController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string() });
  const bodyParams = z.object({
    vendorId: z.string(),
    displayName: z.string(),
    unitType: z.string(),
    packageType: z.string(),
    packageQuantity: z.number(),
    size: z.number().optional(),
    unitOfMeasurement: z.string().nullable(),
  });
  const validatedParams = paramsSchema.parse(req.params);
  const validatedBody = bodyParams.parse(req.body);
  const product = Product.createNewProduct({ ...validatedParams, ...validatedBody });
  const repo = new PostgresProductRepository();
  await product.save(repo);
  return product.toJSON();
};

export const deleteProductController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string(), productId: z.string() });

  const { productId, venueId } = paramsSchema.parse(req.params);
  // return await deleteProductDB(productId);
};

export const updateProductDetailsController: Controller = async req => {
  const paramsSchema = z.object({ productId: z.string() });
  const bodySchema = z.object({
    displayName: z.string().optional(),
    unitType: z
      .object({
        value: z.string(),
        plural: z.string(),
      })
      .optional(),
    packageType: z
      .object({
        value: z.string(),
        plural: z.string(),
      })
      .optional(),
    vendorId: z.string().optional(),

    packageQuantity: z.number().optional(),
    size: z.number().optional(),
    unitOfMeasurement: z
      .object({
        value: z.string(),
      })
      .optional(),
  });
  const { productId } = paramsSchema.parse(req.params);
  const repo = new PostgresProductRepository();
  const product = await Product.reconstituteById(productId, repo);
  const {
    displayName,
    vendorId,
    packageType,
    unitType,
    packageQuantity,
    size,
    unitOfMeasurement,
  } = bodySchema.parse(req.body);

  if (displayName !== undefined) product.displayName = displayName;
  if (vendorId !== undefined) product.vendorId = vendorId;
  if (unitType !== undefined) product.unitType = unitType.value;
  if (packageType !== undefined) product.packageType = packageType.value;
  if (packageQuantity !== undefined) product.packageQuantity = packageQuantity;
  if (size !== undefined) product.size = size;
  if (unitOfMeasurement !== undefined) product.unitOfMeasurement = unitOfMeasurement.value;
  console.log(product);
  await product.save(repo);
  return product.toJSON();
};

export const updateProductVendorController: Controller = async req => {
  const paramsSchema = z.object({ productId: z.string() });
  const bodySchema = z.object({
    vendorId: z.string().nullable(),
  });
  const { productId } = paramsSchema.parse(req.params);
  const { vendorId } = bodySchema.parse(req.body);
  const repo = new PostgresProductRepository();
  const product = await Product.reconstituteById(productId, repo);
  product.vendorId = vendorId;
  await product.save(repo);
  return product;
};
