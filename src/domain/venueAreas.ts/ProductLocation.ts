import { Json } from "../../types/utils";

export type ProductLocationJson = Json<ProductLocation>;

export default class ProductLocation {
  public readonly id?: string;
  public readonly productId: string;
  private _parLevel: number | null;
  private _sortedOrder: number;
  private _lastUpdated: Date | null = null;

  get sortedOrder(): number {
    return this._sortedOrder;
  }

  set sortedOrder(num: number) {
    this._lastUpdated = new Date();
    this._sortedOrder = num;
  }

  get _isUpdated(): boolean {
    return !!this._lastUpdated;
  }

  get _isNew() {
    return !this.id;
  }

  get parLevel(): number | null {
    return this._parLevel;
  }

  set parLevel(parLevel: number | null) {
    this._lastUpdated = new Date();
    this._parLevel = parLevel;
  }

  constructor({ id, productId, parLevel, sortedOrder }: ProductLocationJson) {
    this.id = id;
    this.productId = productId;
    this._parLevel = parLevel;
    this._sortedOrder = sortedOrder;
  }

  toJson(): ProductLocationJson {
    return {
      id: this.id,
      productId: this.productId,
      parLevel: this.parLevel,
      sortedOrder: this.sortedOrder,
    };
  }
}
