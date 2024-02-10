import { Router } from "express";
import expressAdaptor from "../../expressAdaptor";
import { getOrderCommandRoutes, getOrderQueryRoutes } from "./orderControllers";
import {
  getVenueInventoryCommandRoutes,
  getVenueInventoryQueryRoutes,
} from "./inventoryControllers";
import { getAreaCommandRoutes, getAreaQueryRoutes } from "./areaControllers";
import {
  getPreferredVendorCommandRoutes,
  getPreferredVendorQueryRoutes,
} from "./vendorControllers";

const router = Router({ mergeParams: true });

const orderCommandRoutes = getOrderCommandRoutes(expressAdaptor);
const orderQueryRoutes = getOrderQueryRoutes(expressAdaptor);
const inventoryCommandRoutes = getVenueInventoryCommandRoutes(expressAdaptor);
const inventoryQueryRoutes = getVenueInventoryQueryRoutes(expressAdaptor);
const areaCommandRoutes = getAreaCommandRoutes(expressAdaptor);
const areaQueryRoutes = getAreaQueryRoutes(expressAdaptor);
const vendorCommandRoutes = getPreferredVendorCommandRoutes(expressAdaptor);
const vendorQueryRoutes = getPreferredVendorQueryRoutes(expressAdaptor);

router.use("/orders", orderCommandRoutes);
router.use("/orders", orderQueryRoutes);
router.use("/inventory", inventoryCommandRoutes);
router.use("/inventory", inventoryQueryRoutes);
router.use("/areas", areaCommandRoutes);
router.use("/areas", areaQueryRoutes);
router.use("/vendors", vendorCommandRoutes);
router.use("/vendors", vendorQueryRoutes);

export default router;
