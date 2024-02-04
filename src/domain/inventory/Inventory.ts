import { Json } from "../../types/utils";
import { AggregateRoot } from "../writeModel/AggregateRoot";
import { InventoryRepository } from "./InventoryRepository";

export type InventoryJson = Json<Inventory>;

export class Inventory extends AggregateRoot<InventoryRepository> {
  public readonly venueId: string;
  public readonly productId: string;
  private _defaultSupply!: string | null;

  private constructor(
    inventory: InventoryJson,
    repository: InventoryRepository,
    isNew = true
  ) {
    super(repository);
    this._isNew = isNew;
    this.venueId = inventory.venueId;
    this.productId = inventory.productId;
    this.defaultSupply = inventory.defaultSupply;
  }

  get defaultSupply(): string | null {
    return this._defaultSupply;
  }
  set defaultSupply(supplyId: string | null | undefined) {
    this._defaultSupply = supplyId || null;
  }

  static create(inventory: InventoryJson, repository: InventoryRepository) {
    return new Inventory(inventory, repository);
  }

  static reconstitute(inventory: InventoryJson, repository: InventoryRepository) {
    return new Inventory(inventory, repository, false);
  }

  static async reconstituteById(
    venueId: string,
    productId: string,
    repository: InventoryRepository
  ) {
    return await repository.findById(venueId, productId);
  }
}
