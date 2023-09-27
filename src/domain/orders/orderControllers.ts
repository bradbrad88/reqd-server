import { z } from "zod";
import { Controller } from "../../types/IController";
import {
  createOrderDB,
  getOrderDetailDB,
  getOrderHistoryDB,
  getOrdersListDB,
  setProductAmountDB,
} from "./orderPersistence";

const MAX_ORDER_HISTORY = 10;

export const getOrdersListController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string() });
  const querySchema = z.object({ page: z.number().min(1).optional() });
  const { page } = querySchema.parse(req.query);
  const { venueId } = paramsSchema.parse(req.params);
  const orderList = getOrdersListDB(venueId, { page: page || 1 });
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
    productLocationId: z.string(),
    productId: z.string(),
    amount: z.number(),
  });

  const { orderId } = paramsSchema.parse(req.params);
  const { amount, productId, productLocationId } = bodySchema.parse(req.body);
  const res = await setProductAmountDB(orderId, productId, productLocationId, amount);
  return res;
};

export const getOrderHistoryController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string() });
  const querySchema = z.object({ dates: z.string(), orderId: z.string().optional() });

  const { venueId } = paramsSchema.parse(req.params);
  const { dates, orderId } = querySchema.parse(req.query);

  const parsedDates = dates
    // Allow delimiting dates by comma, semicolon or ampersand
    .split(/[,;&]/)
    .slice(0, MAX_ORDER_HISTORY)
    .map(date => new Date(date));
  const filteredDates = parsedDates.filter(
    date => date instanceof Date && !isNaN(date.getTime())
  );
  const weekStartAndEnd = filteredDates.map(date => {
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return { weekStart, weekEnd };
  });
  return await getOrderHistoryDB(venueId, weekStartAndEnd, orderId);
};
