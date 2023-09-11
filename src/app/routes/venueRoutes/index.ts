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
} from "../../../domain/products/productControllers";
import {
  addProductToVenueAreaController,
  createVenueAreaController,
  deleteVenueAreaController,
  getVenueAreaController,
  getVenueAreaProductsController,
  getVenueAreasController,
  removeProductFromAreaController,
} from "../../../domain/venueAreas.ts/venueAreaController";
import {
  createOrderController,
  getOrderDetailController,
  getOrdersListController,
  setProductAmountController,
} from "../../../domain/orders/orderControllers";

const router = Router({ mergeParams: true });

router.get("/", expressAdaptor(getVenueController));
router.patch("/", expressAdaptor(updateVenueNameController));
router.delete("/", expressAdaptor(deleteVenueController));

router.get("/products/list", expressAdaptor(getVenueProductsListController));
router.get("/products/detail/:productId", expressAdaptor(getProductController));
router.post("/products", expressAdaptor(createProductController));
router.put("/products/:productId", expressAdaptor(updateProductDetailsController));
router.delete("/products/:productId", expressAdaptor(deleteProductController));

router.get("/vendors/list", expressAdaptor(getVendorsListController));
router.get("/vendors/detail/:vendorId", expressAdaptor(getVendorDetailController));
router.post("/vendors", expressAdaptor(createVendorController));
router.delete("/vendors/:vendorId", expressAdaptor(deleteVendorController));

router.get("/areas/list", expressAdaptor(getVenueAreasController));
router.get("/areas/detail/:areaId", expressAdaptor(getVenueAreaController));
router.post("/areas", expressAdaptor(createVenueAreaController));
router.delete("/areas/:areaId", expressAdaptor(deleteVenueAreaController));
router.post("/areas/:areaId/products", expressAdaptor(addProductToVenueAreaController));
router.get("/areas/:areaId/products", expressAdaptor(getVenueAreaProductsController));
router.delete("/areas/:areaId/products", expressAdaptor(removeProductFromAreaController));

router.get("/orders/list", expressAdaptor(getOrdersListController));
router.get("/orders/detail/:orderId", expressAdaptor(getOrderDetailController));
router.post("/orders", expressAdaptor(createOrderController));
router.post("/orders/:orderId/product-amount", expressAdaptor(setProductAmountController));

export default router;
