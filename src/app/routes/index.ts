import { Router } from "express";
import venueRoutes from "./venueRoutes";
import expressAdaptor from "../makeCallback";
import { createVenueController } from "../../domain/venues/venueControllers";

const router = Router();

router.use("/venue/:venueId", venueRoutes);
router.post("/", expressAdaptor(createVenueController));

export default router;
