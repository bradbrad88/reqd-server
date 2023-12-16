import expressAdaptor from "../../expressAdaptor";
import { getAdminProductCommandRoutes } from "./productControllers";
import { Router } from "express";
import { getAdminVendorCommandRoutes } from "./vendorControllers";

const router = Router({ mergeParams: true });
const productRoutes = getAdminProductCommandRoutes(expressAdaptor);
const vendorRoutes = getAdminVendorCommandRoutes(expressAdaptor);
router.use("/products", productRoutes);
router.use("/vendors", vendorRoutes);
export default router;
