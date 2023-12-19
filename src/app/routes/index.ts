import { Router } from "express";
import venueRoutes from "./venueRoutes";
import adminRoutes from "./adminRoutes";
import globalRoutes from "./globalRoutes";
const router = Router();

router.use("/venue/:venueId", venueRoutes);
router.use("/", adminRoutes);
router.use("/", globalRoutes);

export default router;
