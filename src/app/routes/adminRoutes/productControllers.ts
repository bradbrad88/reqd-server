import { z } from "zod";
import { Router } from "express";
import Product from "../../../domain/products/Product";
import { getProductRepository } from "../../repository";
import type { Controller, ControllerAdaptor } from "../../../types/IController";

const repo = getProductRepository();

const createProductController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string() });
  const bodyParams = z.object({
    vendorId: z.string().nullable(),
    displayName: z.string(),
    unitType: z.string(),
    size: z.number().optional(),
    unitOfMeasurement: z.string().nullable(),
  });
  const validatedParams = paramsSchema.parse(req.params);
  const validatedBody = bodyParams.parse(req.body);
  const product = Product.create({ ...validatedParams, ...validatedBody }, repo);

  await product.save();
  return product.toJSON();
};

const deleteProductController: Controller = async req => {
  const paramsSchema = z.object({ productId: z.string() });
  const { productId } = paramsSchema.parse(req.params);
  const product = await Product.reconstituteById(productId, repo);
  const res = await product.delete();
  if (!res.success) throw res.error;
  return res;
};

const updateProductDetailsController: Controller = async req => {
  const paramsSchema = z.object({ productId: z.string() });
  const bodySchema = z.object({
    displayName: z.string().optional(),
    unitType: z
      .object({
        value: z.string(),
        plural: z.string(),
      })
      .optional(),
    size: z.number().optional(),
    unitOfMeasurement: z
      .object({
        value: z.string(),
      })
      .optional(),
  });
  const { productId } = paramsSchema.parse(req.params);
  const repo = getProductRepository();
  const product = await Product.reconstituteById(productId, repo);
  const { displayName, unitType, size, unitOfMeasurement } = bodySchema.parse(req.body);

  if (displayName !== undefined) product.displayName = displayName;
  if (unitType !== undefined) product.unitType = unitType.value;
  if (size !== undefined) product.size = size;
  if (unitOfMeasurement !== undefined) product.unitOfMeasurement = unitOfMeasurement.value;
  await product.save();
  return product.toJSON();
};

export const getAdminProductCommandRoutes = (controllerAdaptor: ControllerAdaptor) => {
  const router = Router({ mergeParams: true });
  router.post("/", controllerAdaptor(createProductController));
  router.put("/:productId", controllerAdaptor(updateProductDetailsController));
  router.delete("/:productId", controllerAdaptor(deleteProductController));
  return router;
};
