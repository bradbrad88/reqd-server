import Product, { ProductJson } from "../products/Product";
import Order, { OrderJson } from "./Order";

export const createOrderInteractor = (venueId: string) => {
  const order = new Order({ venueId, createdAt: new Date() });
  return order.toJson();
};

export const setProductAmountInteractor = (
  currentOrder: OrderJson,
  productJson: ProductJson,
  areaId: string,
  amount: number
) => {
  const order = new Order(currentOrder);
  const product = new Product(productJson);
  if (!product.id) throw new Error("Error using product with no ID to update an order");
  order.setItemAmount(product.id, areaId, amount);
  // TODO: Check with Product that the amount set is a multiple of the product package size
  // Eg: Placing an order of Heineken - it has a package size (carton) of 24, so you can order 24, 48 etc (1 carton, 2 cartons)
  return order.toJson();
};
