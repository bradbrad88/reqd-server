import { Json, PartialBy } from "../../types/utils";
import { ProductLine, ProductLineJson } from "./ProductLine";

export type SpotJson = Json<Spot>;

export class Spot {
  public readonly id: string;
  public shelfId: string;
  private _stackHeight: number;
  private _columnWidth: number;
  private _productLine: string | null;

  constructor(spot: SpotJson) {
    const { id, shelfId, columnWidth, stackHeight, productLine } = spot;
    this.id = id;
    this.shelfId = shelfId;
    this._productLine = productLine;
    this._columnWidth = columnWidth;
    this._stackHeight = stackHeight;
  }

  get columnWidth(): number {
    return this._columnWidth;
  }
  set columnWidth(width: number) {
    if (width < 1) throw new Error("Column width must be at least 1");
    if (!Number.isInteger(width)) throw new Error("Column width must be an integer");
    this._columnWidth = width;
  }

  get stackHeight(): number {
    return this._stackHeight;
  }
  set stackHeight(height: number) {
    if (height < 1) throw new Error("Stack height must be at least 1");
    if (!Number.isInteger(height)) throw new Error("Stack height must be an integer");
    this._stackHeight = height;
  }

  get productLine(): string | null {
    return this._productLine;
  }

  setProductLine(productLine: string | null) {
    this._productLine = productLine;
  }
  removeProductLine() {
    if (!this._productLine) return;
    const id = this._productLine;
    this._productLine = null;
    return id;
  }

  toJSON(): SpotJson {
    return {
      id: this.id,
      shelfId: this.shelfId,
      productLine: this.productLine,
      columnWidth: this.columnWidth,
      stackHeight: this.stackHeight,
    };
  }

  static create(id: string, shelfId: string) {
    const columnWidth = 1;
    const stackHeight = 1;
    const productLine = null;
    return new Spot({ id, shelfId, columnWidth, stackHeight, productLine });
  }

  static reconstitute(spot: SpotJson) {
    return new Spot(spot);
  }
}
