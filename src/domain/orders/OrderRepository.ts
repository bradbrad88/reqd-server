import { OperationResponse } from "../../types/OperationResponse";
import { Repository } from "../writeModel/Repository";
import Order from "./Order";

export abstract class OrderRepository implements Repository {
  abstract findOrderById(id: string): Promise<Order>;
  abstract save(order: Order): Promise<OperationResponse>;
  abstract delete(order: Order): Promise<OperationResponse>;
}
