import { v4 as uuid } from "uuid";
import { Json, PartialBy } from "../../types/utils";
import { AggregateRoot } from "../writeModel/AggregateRoot";
import { ProductRepository } from "./ProductRepository";
import ValidationError from "../../errors/ValidationError";

export type ProductJson = PartialBy<Json<Product>, "size">;

export default class Product extends AggregateRoot<ProductRepository> {
  public id: string;
  private _displayName!: string;
  private _venueId!: string | null;
  private _unitType!: string;
  private _size!: number | null;
  private _unitOfMeasurement!: string | null;

  static create(product: PartialBy<ProductJson, "id">, repository: ProductRepository) {
    const id = uuid();
    return new Product({ ...product, id }, repository);
  }

  static async reconstituteById(id: string, repository: ProductRepository) {
    return await repository.findProductById(id);
  }

  static reconstitute(product: ProductJson, repository: ProductRepository) {
    return new Product(product, repository, false);
  }

  get displayName(): string {
    return this._displayName;
  }
  set displayName(newName: string) {
    const validatedName = this.validateName(newName);
    this._displayName = validatedName;
  }

  get venueId(): string | null {
    return this._venueId;
  }
  set venueId(id: string | null) {
    this._venueId = id;
  }

  get unitType(): string {
    return this._unitType;
  }
  set unitType(unitType: string) {
    this._unitType = unitType;
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

  private constructor(product: ProductJson, repository: ProductRepository, isNew = true) {
    super(repository);
    this._isNew = isNew;
    const { id, venueId, displayName, unitType, size, unitOfMeasurement } = product;
    this.id = id;
    this.venueId = venueId;
    this.displayName = displayName;
    this.unitType = unitType;
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
      unitType: this.unitType,
      size: this.size,
      unitOfMeasurement: this.unitOfMeasurement,
    };
  }
}
