import { OperationResponse } from "../../types/OperationResponse";
import { Repository } from "../writeModel/Repository";
import { Inventory } from "./Inventory";

export abstract class InventoryRepository implements Repository {
  abstract findById(venueId: string, productId: string): Promise<Inventory>;
  abstract save(inventory: Inventory): Promise<OperationResponse>;
  abstract delete(inventory: Inventory): Promise<OperationResponse>;
}
