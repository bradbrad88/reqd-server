import { Prisma } from "@prisma/client";
import client from "../../../config/db";
import { OperationResponse } from "../../types/OperationResponse";
import Order, { OrderJson, OrderProductMapJson, SupplyDetailsJson } from "./Order";
import { OrderRepository } from "./OrderRepository";

export class PostgresOrderRepository implements OrderRepository {
  async findOrderById(id: string): Promise<Order> {
    const res = await client.order.findUniqueOrThrow({
      where: { id },
      include: { orderProduct: true },
    });
    const data: Omit<OrderJson, "updatedAt" | "vendors"> = {
      id: res.id,
      venueId: res.venueId,
      createdAt: res.createdAt,
      products: res.orderProduct.reduce((map, product) => {
        map[product.productId] = {
          ...product,
          supplyDetails: product.supplyDetails as SupplyDetailsJson,
        };

        return map;
      }, {} as OrderProductMapJson),
    };
    return Order.reconstitute(data, this);
  }

  async save(order: Order): Promise<OperationResponse> {
    try {
      const data = {
        id: order.id,
        venueId: order.venueId,
        vendorSummary: order.vendors,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
      if (order.isNew()) {
        client.$transaction(async () => {
          const { id } = await client.order.create({ data });
          const orderProductData = Object.values(order.products).map(product => ({
            orderId: id,
            productId: product.productId,
            quantity: product.quantity,
            supplyDetails:
              product.supplyDetails ||
              (Prisma.JsonNull as SupplyDetailsJson | typeof Prisma.JsonNull),
          }));
          await client.orderProduct.createMany({ data: orderProductData });
        });
      } else {
        client.$transaction(async () => {
          const orderPromise = client.order.update({ data, where: { id: order.id } });
          const additions = Array.from(order._additions).map(async productId => {
            const product = order.products[productId];
            return await client.orderProduct.create({
              data: {
                orderId: order.id,
                productId: productId,
                quantity: product.quantity,
                supplyDetails: product.supplyDetails || Prisma.JsonNull,
              },
            });
          });
          const changes = Array.from(order._changes).map(async productId => {
            const product = order.products[productId];
            return await client.orderProduct.update({
              where: { orderId_productId: { productId, orderId: order.id } },
              data: {
                quantity: product.quantity,
                supplyDetails: product.supplyDetails || Prisma.JsonNull,
              },
            });
          });
          const deletions = Array.from(order._deletions).map(async productId => {
            return await client.orderProduct.delete({
              where: { orderId_productId: { orderId: order.id, productId } },
            });
          });
          const res = await Promise.all([
            orderPromise,
            ...additions,
            ...changes,
            ...deletions,
          ]);
        });
      }
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  async delete(order: Order): Promise<OperationResponse> {
    try {
      await client.order.delete({ where: { id: order.id } });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}
