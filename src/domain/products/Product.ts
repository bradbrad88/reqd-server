import type { Json, PartialBy } from "../../types/utils";
import ValidationError from "../../errors/ValidationError";

export type ProductJson = PartialBy<Json<Product>, "size">;

export default class Product {
  public id?: string;
  private _displayName!: string;
  public venueId: string;
  public vendorId: string | null;
  public unitType: string;
  public packageType: string;
  public _packageQuantity!: number;
  public _size?: number | null;
  public unitOfMeasurement?: string | null;

  public get displayName(): string {
    return this._displayName;
  }

  public set displayName(newName) {
    const validatedName = this.validateName(newName);
    this._displayName = validatedName;
  }

  public get packageQuantity(): number {
    return this._packageQuantity;
  }
  public set packageQuantity(quantity: number) {
    NonNegativePolicy(quantity);
    this._packageQuantity = quantity;
  }

  public get size(): number | null | undefined {
    return this._size;
  }
  public set size(size: number | null | undefined) {
    NonNegativePolicy(size);
    this._size = size;
  }

  constructor({
    id,
    displayName,
    vendorId,
    venueId,
    unitType,
    packageType,
    packageQuantity,
    size,
    unitOfMeasurement,
  }: ProductJson) {
    this.id = id;
    this.displayName = displayName;
    this.vendorId = vendorId;
    this.venueId = venueId;
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
  toJson(): ProductJson {
    return {
      id: this.id,
      displayName: this.displayName,
      vendorId: this.vendorId,
      venueId: this.venueId,
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
