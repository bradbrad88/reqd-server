import { Router } from "express";
import { getEnumerablesGlobalQueryControllers } from "./enumerables";
import adaptor from "../../expressAdaptor";

const router = Router({ mergeParams: true });

const globalEnumerableQueryRoutes = getEnumerablesGlobalQueryControllers(adaptor);

router.use("/enumerables", globalEnumerableQueryRoutes);

export default router;
