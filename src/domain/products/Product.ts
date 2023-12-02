import { v4 as uuid } from "uuid";
import { Json, PartialBy } from "../../types/utils";
import { AggregateRoot } from "../writeModel/AggregateRoot";
import { ProductRepository } from "./ProductRepository";
import ValidationError from "../../errors/ValidationError";

export type ProductJson = PartialBy<Json<Product>, "size">;

export default class Product extends AggregateRoot<ProductRepository> {
  public id: string;
  private _displayName!: string;
  private _venueId!: string;
  private _vendorId!: string | null;
  private _unitType!: string;
  private _packageType!: string;
  private _packageQuantity!: number;
  private _size!: number | null;
  private _unitOfMeasurement!: string | null;

  static createNewProduct(product: PartialBy<ProductJson, "id">) {
    const id = uuid();
    return new Product({ ...product, id });
  }

  static async reconstituteById(id: string, repository: ProductRepository) {
    return await repository.findProductById(id);
  }

  get displayName(): string {
    return this._displayName;
  }
  set displayName(newName: string) {
    const validatedName = this.validateName(newName);
    this._displayName = validatedName;
  }

  get venueId(): string {
    return this._venueId;
  }
  set venueId(id: string) {
    this._venueId = id;
  }

  get vendorId(): string | null {
    return this._vendorId;
  }
  set vendorId(vendorId: string | null) {
    if (typeof vendorId === "string" && vendorId.length < 1) {
      this._vendorId = null;
    } else {
      this._vendorId = vendorId;
    }
  }

  get unitType(): string {
    return this._unitType;
  }
  set unitType(unitType: string) {
    this._unitType = unitType;
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
  set packageQuantity(qty: number) {
    NonNegativePolicy(qty);
    this._packageQuantity = qty;
  }

  get size(): number | null {
    return this._size || null;
  }
  set size(size: number | null | undefined) {
    this._size = size || null;
  }

  get unitOfMeasurement(): string | null {
    return this._unitOfMeasurement;
  }
  set unitOfMeasurement(unitOfMeasurement) {
    this._unitOfMeasurement = unitOfMeasurement;
  }

  constructor(product: ProductJson, isNew = true) {
    super();
    this._isNew = isNew;
    const {
      id,
      venueId,
      displayName,
      vendorId,
      unitType,
      packageType,
      packageQuantity,
      size,
      unitOfMeasurement,
    } = product;
    this.id = id;
    this.venueId = venueId;
    this.displayName = displayName;
    this.vendorId = vendorId;
    this.unitType = unitType;
    this.packageType = packageType;
    this.packageQuantity = packageQuantity;
    this.size = size;
    this.unitOfMeasurement = unitOfMeasurement;
  }

  private validateName(newName: string): string {
    const minLength = 2;
    const trimmedName = newName.trim();
    if (trimmedName.length < minLength) {
      throw ValidationError.MinimumLength(trimmedName, minLength);
    }
    return trimmedName;
  }

  toJSON() {
    return {
      id: this.id,
      displayName: this.displayName,
      venueId: this.venueId,
      vendorId: this.vendorId,
      unitType: this.unitType,
      packageType: this.packageType,
      packageQuantity: this.packageQuantity,
      size: this.size,
      unitOfMeasurement: this.unitOfMeasurement,
    };
  }
}

function NonNegativePolicy(number: unknown) {
  const num = Number(number);
  if (num < 0) throw new Error("Non Negative Number Policy Failed: input is negative");
}
