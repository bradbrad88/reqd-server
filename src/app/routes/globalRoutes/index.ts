import { Router } from "express";
import { getProductGlobalQueryControllers } from "./productGlobalControllers";
import { getEnumerablesGlobalQueryControllers } from "./enumerables";
import adaptor from "../../expressAdaptor";

const router = Router({ mergeParams: true });

const globalProductQueryRoutes = getProductGlobalQueryControllers(adaptor);
const globalEnumerableQueryRoutes = getEnumerablesGlobalQueryControllers(adaptor);

router.use("/products", globalProductQueryRoutes);
router.use("/enumerables", globalEnumerableQueryRoutes);

export default router;
