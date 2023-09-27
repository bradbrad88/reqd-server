import { Router } from "express";
import expressAdaptor from "../../makeCallback";

import {
  getVenueController,
  updateVenueNameController,
  deleteVenueController,
} from "../../../domain/venues/venueControllers";
import {
  createVendorController,
  deleteVendorController,
  getVendorDetailController,
  getVendorsListController,
} from "../../../domain/vendors/vendorControllers";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getVenueProductsListController,
  updateProductDetailsController,
  updateProductVendorController,
} from "../../../domain/products/productControllers";
import {
  addProductToVenueAreaController,
  createVenueAreaController,
  deleteVenueAreaController,
  getVenueAreaController,
  getVenueAreasController,
  removeProductFromAreaController,
  setProductLocationParLevelController,
} from "../../../domain/venueAreas.ts/venueAreaController";
import {
  createOrderController,
  getOrderDetailController,
  getOrderHistoryController,
  getOrdersListController,
  setProductAmountController,
} from "../../../domain/orders/orderControllers";
import { getUnitTypeController } from "../../../domain/scalars/unitTypeControllers";
import { getPackageTypeController } from "../../../domain/scalars/packageTypeControllers";
import { getUnitOfMeasurementController } from "../../../domain/scalars/unitOfMeasurementControllers";

const router = Router({ mergeParams: true });

router.get("/", expressAdaptor(getVenueController));
router.patch("/", expressAdaptor(updateVenueNameController));
router.delete("/", expressAdaptor(deleteVenueController));

router.get("/unit-types/list", expressAdaptor(getUnitTypeController));
router.get("/package-types/list", expressAdaptor(getPackageTypeController));
router.get("/unit-of-measurements/list", expressAdaptor(getUnitOfMeasurementController));

router.get("/products/list", expressAdaptor(getVenueProductsListController));
router.get("/products/detail/:productId", expressAdaptor(getProductController));
router.post("/products", expressAdaptor(createProductController));
router.put("/products/:productId", expressAdaptor(updateProductDetailsController));
router.delete("/products/:productId", expressAdaptor(deleteProductController));
router.put("/products/:productId/vendor", expressAdaptor(updateProductVendorController));

router.get("/vendors/list", expressAdaptor(getVendorsListController));
router.get("/vendors/detail/:vendorId", expressAdaptor(getVendorDetailController));
router.post("/vendors", expressAdaptor(createVendorController));
router.delete("/vendors/:vendorId", expressAdaptor(deleteVendorController));

router.get("/areas/list", expressAdaptor(getVenueAreasController));
router.get("/areas/detail/:areaId", expressAdaptor(getVenueAreaController));
router.post("/areas", expressAdaptor(createVenueAreaController));
router.delete("/areas/:areaId", expressAdaptor(deleteVenueAreaController));
router.post("/areas/:areaId/products", expressAdaptor(addProductToVenueAreaController));
router.put(
  "/areas/:areaId/products/:productLocation",
  expressAdaptor(setProductLocationParLevelController)
);
router.delete(
  "/areas/:areaId/products/:productLocation",
  expressAdaptor(removeProductFromAreaController)
);

router.get("/orders/list", expressAdaptor(getOrdersListController));
router.get("/orders/detail/:orderId", expressAdaptor(getOrderDetailController));
router.post("/orders", expressAdaptor(createOrderController));
router.post("/orders/:orderId/product-amount", expressAdaptor(setProductAmountController));
router.get("/orders/history", expressAdaptor(getOrderHistoryController));

export default router;
