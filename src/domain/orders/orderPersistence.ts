import { z } from "zod";
import client from "../../../config/db";
import { createOrderInteractor, setProductAmountInteractor } from "./orderInteractor";

const OrderItemsSchema = z
  .object({
    productId: z.string(),
    totalAmount: z.number(),
    areaAmounts: z.object({ productLocationId: z.string(), amount: z.number() }).array(),
  })
  .array();

export const getOrdersListDB = async (venueId: string) => {
  const res = await client.order.findMany({
    where: { venueId },
    select: { id: true, createdAt: true, updatedAt: true },
  });
  return res;
};

export const getOrderDetailDB = async (orderId: string) => {
  const order = await client.order.findUniqueOrThrow({ where: { id: orderId } });
  const items = OrderItemsSchema.parse(order.items);
  return { ...order, items };
};

export const createOrderDB = async (venueId: string) => {
  const { id, ...data } = createOrderInteractor(venueId);
  const res = await client.order.create({ data });
  return res;
};

export const setProductAmountDB = async (
  orderId: string,
  productId: string,
  productLocationId: string,
  amount: number
) => {
  const order = await client.order.findUniqueOrThrow({ where: { id: orderId } });
  const product = await client.product.findUniqueOrThrow({ where: { id: productId } });
  const items = OrderItemsSchema.parse(order.items);

  const { id, ...updatedOrder } = setProductAmountInteractor(
    { ...order, items },
    product,
    productLocationId,
    amount
  );
  const res = await client.order.update({
    where: { id: orderId },
    data: { ...updatedOrder },
  });
  return res;
};
