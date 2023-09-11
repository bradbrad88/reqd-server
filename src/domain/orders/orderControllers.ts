import { z } from "zod";
import { Controller } from "../../types/IController";
import {
  createOrderDB,
  getOrderDetailDB,
  getOrdersListDB,
  setProductAmountDB,
} from "./orderPersistence";

export const getOrdersListController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string() });
  const { venueId } = paramsSchema.parse(req.params);
  const orderList = getOrdersListDB(venueId);
  return orderList;
};

export const getOrderDetailController: Controller = async req => {
  const paramsSchema = z.object({ orderId: z.string() });
  const { orderId } = paramsSchema.parse(req.params);
  const order = getOrderDetailDB(orderId);
  return order;
};

export const createOrderController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string() });
  const { venueId } = paramsSchema.parse(req.params);
  const res = await createOrderDB(venueId);
  return res;
};

export const setProductAmountController: Controller = async req => {
  const paramsSchema = z.object({ orderId: z.string() });
  const bodySchema = z.object({
    productId: z.string(),
    areaId: z.string(),
    amount: z.number(),
  });
  const { orderId } = paramsSchema.parse(req.params);
  const { amount, areaId, productId } = bodySchema.parse(req.body);
  const res = await setProductAmountDB(orderId, productId, areaId, amount);
  return res;
};
