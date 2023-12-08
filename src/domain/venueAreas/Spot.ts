import { Json, PartialBy } from "../../types/utils";

export type SpotJson = Json<Spot>;

export class Spot {
  private _position: number;
  private _productId!: string | null;
  private _parLevel!: number | null;
  private _columnSpan!: number;

  constructor(spot: SpotJson) {
    this._position = spot.position;
    this.columnSpan = spot.columnSpan;
    this.parLevel = spot.parLevel;
    this.productId = spot.productId;
  }

  get position(): number {
    return this._position;
  }

  get productId(): string | null {
    return this._productId;
  }
  set productId(id: string | null) {
    this._productId = id;
  }

  get parLevel(): number | null {
    return this._parLevel;
  }
  set parLevel(parLevel: number | null) {
    this._parLevel = parLevel;
  }

  get columnSpan(): number {
    return this._columnSpan;
  }
  set columnSpan(span: number) {
    this._columnSpan = span;
  }

  assignPosition(position: number) {
    this._position = position;
  }

  toJSON() {
    return {
      columnSpan: this.columnSpan,
      position: this.position,
      productId: this.productId,
      parLevel: this.parLevel,
    };
  }

  static create(
    spot?: PartialBy<SpotJson, "position" | "parLevel" | "columnSpan" | "productId">
  ) {
    const columnSpan = spot?.columnSpan || 1;
    const parLevel = spot?.parLevel || null;
    const productId = spot?.productId || null;
    const position = -1;
    return new Spot({ columnSpan, position, parLevel, productId });
  }
}
