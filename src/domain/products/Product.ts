import type { Json } from "../../types/utils";
import ValidationError from "../../errors/ValidationError";

export type ProductJson = Json<Product>;

export default class Product {
  public id?: string;
  private _displayName!: string;
  public venueId: string;
  public vendorId: string | null;
  public size?: number | null;
  public measure?: string | null;

  public get displayName(): string {
    return this._displayName;
  }

  public set displayName(newName) {
    const validatedName = this.validateName(newName);
    this._displayName = validatedName;
  }

  constructor({ id, displayName, vendorId, venueId, size, measure }: ProductJson) {
    this.id = id;
    this.displayName = displayName;
    this.vendorId = vendorId;
    this.venueId = venueId;
    this.size = size;
    this.measure = measure;
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
      measure: this.measure,
      size: this.size,
    };
  }
}
