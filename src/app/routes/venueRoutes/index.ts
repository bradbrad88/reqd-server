import { Router } from "express";
import { getVenueController } from "../../../venues/venueControllers";
import makeExpressCallback from "../../makeCallback";

const router = Router();

router.get("/:venueId", makeExpressCallback(getVenueController));

export default router;
