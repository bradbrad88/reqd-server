import { Router } from "express";
import { Controller, ControllerAdaptor } from "../../../types/IController";
import { z } from "zod";
import Order from "../../../domain/orders/Order";
import { getOrderRepository } from "../../repository";
import {
  getOrderDetailById,
  getOrderHistoryByVenue,
  getOrderListByVenue,
  getVendorOrderSummary,
} from "../../../domain/readModel";
import { getSupplyDetails } from "../../../domain/readModel/vendorQueries";

const MAX_ORDER_HISTORY = 10;

const repo = getOrderRepository();

const createOrder: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string() });
  const bodySchema = z.object({ orderId: z.string().uuid() });
  const { venueId } = paramsSchema.parse(req.params);
  const { orderId } = bodySchema.parse(req.body);
  const order = Order.create({ id: orderId, venueId }, repo);
  const res = await order.save();
  if (!res.success) throw res.error;
  return res;
};

const setProductQuantity: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string(), orderId: z.string() });
  const { orderId } = paramsSchema.parse(req.params);
  const bodySchema = z.object({
    productId: z.string(),
    quantity: z.number(),
    supplyDetails: z.string().optional(),
  });
  const { productId, quantity, supplyDetails } = bodySchema.parse(req.body);
  const order = await Order.reconstituteById(orderId, repo);
  if (supplyDetails) {
    const supplyDetailsObject = await getSupplyDetails(supplyDetails);
    order.setProductAmount(productId, quantity, supplyDetailsObject);
  } else {
    order.setProductAmount(productId, quantity);
  }
  const res = await order.save();
  if (!res.success) throw res.error;
  return res;
};

const setProductSupplyDetails: Controller = async req => {
  const paramsSchema = z.object({ orderId: z.string() });
  const { orderId } = paramsSchema.parse(req.params);
  const bodySchema = z.object({
    productId: z.string(),
    supplyDetails: z.object({
      packageType: z.string(),
      packageQuantity: z.number(),
      vendorId: z.string(),
      vendorRangeId: z.string(),
    }),
  });
  const { productId, supplyDetails } = bodySchema.parse(req.body);
  const order = await Order.reconstituteById(orderId, repo);
  order.changeSupplyDetails(productId, supplyDetails);
  const res = await order.save();
  if (!res.success) throw res.error;
  return res;
};

const getOrderList: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string() });
  const { venueId } = paramsSchema.parse(req.params);
  const orders = await getOrderListByVenue(venueId);
  return orders;
};

const getOrderDetail: Controller = async req => {
  const paramsSchema = z.object({ orderId: z.string() });
  const { orderId } = paramsSchema.parse(req.params);
  const order = await getOrderDetailById(orderId);
  return order;
};

const getVendorSummary: Controller = async req => {
  const paramsSchema = z.object({
    venueId: z.string(),
    orderId: z.string(),
    vendorId: z.string(),
  });
  const { orderId, venueId, vendorId } = paramsSchema.parse(req.params);
  return await getVendorOrderSummary(orderId, vendorId, venueId);
};

const getOrderHistory: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string(), orderId: z.string() });
  const querySchema = z.object({ dates: z.string() });
  const { orderId, venueId } = paramsSchema.parse(req.params);
  const { dates } = querySchema.parse(req.query);
  const parsedDates = dates
    // Allow delimiting dates by comma, semicolon or ampersand
    .split(/[,;&]/)
    .slice(0, MAX_ORDER_HISTORY)
    .map(date => new Date(date));
  const filteredDates = parsedDates.filter(
    date => date instanceof Date && !isNaN(date.getTime())
  );
  const periodStartAndEnd = filteredDates.map(date => {
    const periodStart = new Date(date);
    periodStart.setDate(periodStart.getDate() - ((periodStart.getDay() + 6) % 7));
    const periodEnd = new Date(periodStart);
    periodEnd.setDate(periodEnd.getDate() + 6);
    return { periodStart, periodEnd };
  });
  const res = await getOrderHistoryByVenue(venueId, periodStartAndEnd, orderId);
  return res;
};

export const getOrderCommandRoutes = (controllerAdaptor: ControllerAdaptor) => {
  const router = Router({ mergeParams: true });
  router.post("/", controllerAdaptor(createOrder));
  router.put("/:orderId/quantity", controllerAdaptor(setProductQuantity));
  router.put("/:orderId/supplyDetails", controllerAdaptor(setProductSupplyDetails));
  return router;
};

export const getOrderQueryRoutes = (controllerAdaptor: ControllerAdaptor) => {
  const router = Router({ mergeParams: true });
  router.get("/list", controllerAdaptor(getOrderList));
  router.get("/detail/:orderId", controllerAdaptor(getOrderDetail));
  router.get("/detail/:orderId/:vendorId", controllerAdaptor(getVendorSummary));
  router.get("/history/:orderId", controllerAdaptor(getOrderHistory));
  return router;
};
