import { z } from "zod";
import { Router } from "express";
import { Controller, ControllerAdaptor } from "../../../types/IController";
import { Inventory } from "../../../domain/inventory/Inventory";
import { getInventoryRepository, getVendorRangeRepository } from "../../repository";
import { VendorRange } from "../../../domain/vendorRange/VendorRange";

const repo = getInventoryRepository();

const addProductToInventoryController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string() });
  const bodySchema = z.object({
    productId: z.string(),
    defaultSupply: z.string().nullable(),
  });
  const { productId, defaultSupply } = bodySchema.parse(req.body);
  const { venueId } = paramsSchema.parse(req.params);
  await validateDefaultSupply(productId, defaultSupply);
  const inventory = Inventory.create({ venueId, productId, defaultSupply });
  const res = await inventory.save(repo);
  if (!res.success) throw res.error;
  return res;
};

const removeProductFromInventoryController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string() });
  const bodySchema = z.object({
    productId: z.string(),
  });
  const { productId } = bodySchema.parse(req.body);
  const { venueId } = paramsSchema.parse(req.params);
  const inventory = await Inventory.reconstituteById(venueId, productId, repo);
  const res = await inventory.delete(repo);
  if (!res.success) throw res.error;
  return res;
};

const changeDefaultSupplyController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string() });
  const bodySchema = z.object({ productId: z.string(), defaultSupply: z.string().nullable() });
  const { venueId } = paramsSchema.parse(req.params);
  const { productId, defaultSupply } = bodySchema.parse(req.body);
  validateDefaultSupply(productId, defaultSupply);
  const inventory = await Inventory.reconstituteById(venueId, productId, repo);
  inventory.defaultSupply = defaultSupply;
  const res = await inventory.save(repo);
  if (!res.success) throw res.error;
  return res;
};

export const getVenueInventoryCommandRoutes = (controllerAdaptor: ControllerAdaptor) => {
  const router = Router({ mergeParams: true });
  router.post("/", controllerAdaptor(addProductToInventoryController));
  router.delete("/", controllerAdaptor(removeProductFromInventoryController));
  router.put("/", controllerAdaptor(changeDefaultSupplyController));
  return router;
};

async function validateDefaultSupply(productId: string, defaultSupply: string | null) {
  if (!defaultSupply) return;
  const vendorRange = await VendorRange.reconstituteById(
    defaultSupply,
    getVendorRangeRepository()
  );
  if (vendorRange.productId !== productId)
    throw new Error("Default supplyID does not match correct product ID");
}
