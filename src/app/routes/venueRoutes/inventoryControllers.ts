import { z } from "zod";
import { Router } from "express";
import { Controller, ControllerAdaptor } from "../../../types/IController";
import { Inventory } from "../../../domain/inventory/Inventory";
import { getInventoryRepository, getVendorRangeRepository } from "../../repository";
import { VendorRange } from "../../../domain/vendorRange/VendorRange";
import { getVenueInventory } from "../../../domain/readModel/inventoryQueries";

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
  const inventory = Inventory.create({ venueId, productId, defaultSupply }, repo);
  const res = await inventory.save();
  if (!res.success) throw res.error;
  return res;
};

const removeProductFromInventoryController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string(), productId: z.string() });
  const { venueId, productId } = paramsSchema.parse(req.params);
  const inventory = await Inventory.reconstituteById(venueId, productId, repo);
  const res = await inventory.delete();
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
  const res = await inventory.save();
  if (!res.success) throw res.error;
  return res;
};

const getVenueInventoryListController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string() });
  const querySchema = z.object({ query: z.string().optional() });
  const { venueId } = paramsSchema.parse(req.params);
  const { query } = querySchema.parse(req.query);
  const inventory = await getVenueInventory(venueId, query);
  return inventory;
};

export const getVenueInventoryCommandRoutes = (controllerAdaptor: ControllerAdaptor) => {
  const router = Router({ mergeParams: true });
  router.post("/", controllerAdaptor(addProductToInventoryController));
  router.delete("/:productId", controllerAdaptor(removeProductFromInventoryController));
  router.put("/", controllerAdaptor(changeDefaultSupplyController));
  return router;
};

export const getVenueInventoryQueryRoutes = (controllerAdaptor: ControllerAdaptor) => {
  const router = Router({ mergeParams: true });
  router.get("/list", controllerAdaptor(getVenueInventoryListController));
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
