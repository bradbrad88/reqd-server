import { Router } from "express";
import {
  getVenueController,
  createVenueController,
  updateVenueNameController,
  deleteVenueController,
} from "../../../venues/venueControllers";
import expressAdapator from "../../makeCallback";

const router = Router();

router.get("/:venueId", expressAdapator(getVenueController));
router.post("/", expressAdapator(createVenueController));
router.patch("/:venueId", expressAdapator(updateVenueNameController));
router.delete("/:venueId", expressAdapator(deleteVenueController));

export default router;
