import { Router } from "express";
import venueRoutes from "./venueRoutes";

const router = Router();

router.use("/venue", venueRoutes);

export default router;
