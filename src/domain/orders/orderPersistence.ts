import client from "../../../config/db";
import { createOrderInteractor, setProductAmountInteractor } from "./orderInteractor";
import { OrderItem } from "@prisma/client";

type AreaAmount = {
  productLocationId: string;
  amount: number;
};

type OrderItemLocations = {
  productId: string;
  totalAmount: number;
  areaAmounts: AreaAmount[];
};

export const getOrdersListDB = async (
  venueId: string,
  options: { page: number } = { page: 1 }
) => {
  const take = 20;
  const skip = take * (options.page - 1);
  const res = await client.order.findMany({
    where: { venueId },
    include: { OrderItem: { include: { productLocation: { include: { venueArea: true } } } } },
    orderBy: { createdAt: "desc" },
    take,
    skip,
  });
  const orders = res.map(order => {
    const areas = Array.from(
      new Set(order.OrderItem.map(orderItem => orderItem.productLocation.venueArea.areaName))
    );
    return {
      id: order.id,
      venueId: order.venueId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      areas,
    };
  });
  return orders;
};

export const getOrderDetailDB = async (orderId: string) => {
  const order = await client.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { OrderItem: true },
  });

  const items = transformOrderItems(order.OrderItem);

  return { ...order, items: Array.from(items.values()) };
};

export const createOrderDB = async (venueId: string) => {
  const { id, items, ...data } = createOrderInteractor(venueId);
  const res = await client.order.create({ data });
  return res;
};

export const getOrderHistoryDB = async (
  venueId: string,
  dates: { weekStart: Date; weekEnd: Date }[],
  orderId?: string
) => {
  const promises = dates.map(({ weekStart, weekEnd }) => {
    return client.order.findMany({
      where: {
        AND: [
          { venueId },
          { createdAt: { gte: weekStart, lte: weekEnd } },
          { id: { not: orderId } },
        ],
      },
      select: { id: true, OrderItem: { select: { quantity: true, productId: true } } },
    });
  });
  const res = await Promise.all(promises);
  const weeks = res.map((orders, idx) => {
    // Return a dynamic number of weeks of orders
    const productMap = orders.reduce((map, order) => {
      // Reduce a week of orders into a map of productIds: quantity
      for (const orderItem of order.OrderItem) {
        const product = map.get(orderItem.productId) || {
          productId: orderItem.productId,
          quantity: 0,
        };
        map.set(orderItem.productId, {
          ...product,
          quantity: product.quantity + orderItem.quantity,
        });
      }
      return map;
    }, new Map<string, { productId: string; quantity: number }>());
    return { week: dates[idx].weekStart, products: Array.from(productMap.values()) };
  });
  return weeks;
};

export const setProductAmountDB = async (
  orderId: string,
  productId: string,
  productLocationId: string,
  amount: number
) => {
  const order = await client.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { OrderItem: true },
  });
  const product = await client.product.findUniqueOrThrow({ where: { id: productId } });
  const items = transformOrderItems(order.OrderItem);
  const { id, ...updatedOrder } = setProductAmountInteractor(
    { ...order, items },
    product,
    productLocationId,
    amount
  );

  const updates = updatedOrder.items.flatMap(item => {
    const updates = item.areaAmounts.map(areaAmount => {
      return client.orderItem.upsert({
        where: {
          orderId_productLocationId: {
            orderId,
            productLocationId: areaAmount.productLocationId,
          },
        },
        create: { orderId, productId, productLocationId, quantity: areaAmount.amount },
        update: { quantity: areaAmount.amount },
      });
    });
    return updates;
  });

  await client.$transaction(updates);
  await client.orderItem.deleteMany({
    where: { AND: [{ orderId }, { quantity: { equals: 0 } }] },
  });
  const res = client.order.update({
    where: { id: orderId },
    data: { updatedAt: order.updatedAt },
  });
  return res;
};

function transformOrderItems(items: OrderItem[]) {
  const map = items.reduce((map, orderItem) => {
    const areaAmount = {
      productLocationId: orderItem.productLocationId,
      amount: orderItem.quantity,
    };
    const product = map.get(orderItem.productId) || {
      productId: orderItem.productId,
      areaAmounts: [],
      totalAmount: 0,
    };
    const areaAmounts = [...product.areaAmounts, areaAmount];
    const totalAmount = areaAmounts.reduce((total, area) => total + area.amount, 0);
    const updatedProduct = { ...product, totalAmount, areaAmounts };
    return map.set(orderItem.productId, updatedProduct);
  }, new Map<string, OrderItemLocations>());
  return Array.from(map.values());
}
