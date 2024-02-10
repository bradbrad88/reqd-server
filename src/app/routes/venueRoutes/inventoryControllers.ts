import { z } from "zod";
import { Router } from "express";
import { Controller, ControllerAdaptor } from "../../../types/IController";
import { Inventory } from "../../../domain/inventory/Inventory";
import { getInventoryRepository, getVendorRangeRepository } from "../../repository";
import { VendorRange } from "../../../domain/vendorRange/VendorRange";
import {
  getGlobalProducts,
  getProductVendorOptions,
  getVenueInventory,
  getVenueInventoryItem,
} from "../../../domain/readModel/inventoryQueries";

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
  const paramsSchema = z.object({ venueId: z.string(), productId: z.string() });
  const bodySchema = z.object({
    defaultSupply: z.string().nullable(),
    isNew: z.boolean().optional(),
  });
  const { venueId, productId } = paramsSchema.parse(req.params);
  const { defaultSupply, isNew } = bodySchema.parse(req.body);
  await validateDefaultSupply(productId, defaultSupply);
  let inventory: Inventory;
  if (isNew) {
    inventory = Inventory.create({ venueId, productId, defaultSupply }, repo);
  } else {
    inventory = await Inventory.reconstituteById(venueId, productId, repo);
    inventory.defaultSupply = defaultSupply;
  }
  const res = await inventory.save();
  if (!res.success) throw res.error;
  return res;
};

const getVenueInventoryListController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string() });
  const { venueId } = paramsSchema.parse(req.params);
  const querySchema = z.object({
    query: z.string().optional(),
    page: z.string().optional(),
    pageSize: z.string().optional(),
  });
  const { query, page, pageSize } = querySchema.parse(req.query);
  const transformedFilters = { query };
  const pageValidated = parseInt(page || "1");
  const pageSizeValidated = Math.min(parseInt(pageSize || "20"), 50);
  const res = await getGlobalProducts(
    venueId,
    transformedFilters,
    pageValidated,
    pageSizeValidated
  );
  return res;
};

const getVenueInventoryDetailController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string(), productId: z.string() });
  const { venueId, productId } = paramsSchema.parse(req.params);
  return await getVenueInventoryItem(venueId, productId);
};

const getProductVendorOptionsController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string(), productId: z.string() });
  const { venueId, productId } = paramsSchema.parse(req.params);
  return await getProductVendorOptions(venueId, productId);
};

export const getVenueInventoryCommandRoutes = (controllerAdaptor: ControllerAdaptor) => {
  const router = Router({ mergeParams: true });
  router.post("/", controllerAdaptor(addProductToInventoryController));
  router.delete("/:productId", controllerAdaptor(removeProductFromInventoryController));
  router.put("/:productId", controllerAdaptor(changeDefaultSupplyController));
  return router;
};

export const getVenueInventoryQueryRoutes = (controllerAdaptor: ControllerAdaptor) => {
  const router = Router({ mergeParams: true });
  router.get("/list", controllerAdaptor(getVenueInventoryListController));
  router.get("/detail/:productId", controllerAdaptor(getVenueInventoryDetailController));
  router.get(
    "/detail/:productId/vendors",
    controllerAdaptor(getProductVendorOptionsController)
  );
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
