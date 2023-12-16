import adaptor from "../../expressAdaptor";
import { getAdminProductCommandRoutes } from "./productControllers";
import { Router } from "express";
import { getAdminVendorCommandRoutes } from "./vendorControllers";
import { getAdminEnumerableCommandRoutes } from "./enumerables";

const router = Router({ mergeParams: true });
const productRoutes = getAdminProductCommandRoutes(adaptor);
const vendorRoutes = getAdminVendorCommandRoutes(adaptor);
const enumerableRoutes = getAdminEnumerableCommandRoutes(adaptor);
router.use("/products", productRoutes);
router.use("/vendors", vendorRoutes);
router.use("/enumerables", enumerableRoutes);
export default router;
