import { v4 as uuid } from "uuid";
import { Json, PartialBy } from "../../types/utils";
import { AggregateRoot } from "../writeModel/AggregateRoot";
import { VendorRangeRepository } from "./VendorRangeRepository";

export type VendorRangeJson = Json<VendorRange>;

export class VendorRange extends AggregateRoot<VendorRangeRepository> {
  public readonly id: string;
  public readonly productId: string;
  public readonly vendorId: string;
  private _packageType!: string;
  private _packageQuantity!: number;

  private constructor(
    vendorRange: VendorRangeJson,
    repository: VendorRangeRepository,
    isNew = true
  ) {
    super(repository);
    this._isNew = isNew;
    this.id = vendorRange.id;
    this.productId = vendorRange.productId;
    this.vendorId = vendorRange.vendorId;
    this.packageType = vendorRange.packageType;
    this.packageQuantity = vendorRange.packageQuantity;
  }

  get packageType(): string {
    return this._packageType;
  }
  set packageType(packageType: string) {
    this._packageType = packageType;
  }

  get packageQuantity(): number {
    return this._packageQuantity;
  }
  set packageQuantity(quantity: number) {
    this._packageQuantity = quantity;
  }

  static create(
    vendorRange: PartialBy<VendorRangeJson, "id">,
    repository: VendorRangeRepository
  ) {
    const id = uuid();
    return new VendorRange({ ...vendorRange, id }, repository);
  }

  static async reconstituteById(id: string, repository: VendorRangeRepository) {
    return await repository.findById(id);
  }

  static reconstitute(vendorRange: VendorRangeJson, repository: VendorRangeRepository) {
    return new VendorRange(vendorRange, repository, false);
  }
}
