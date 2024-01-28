import { Json } from "../../types/utils";

export type ProductLineJson = Json<ProductLine>;

export class ProductLine {
  public readonly id: string;
  public productId: string | null;
  public parLevel: number | null;

  constructor(productLine: ProductLineJson) {
    const { id, productId, parLevel } = productLine;
    this.id = id;
    this.productId = productId;
    this.parLevel = parLevel;
  }

  static create(productLine: ProductLineJson) {
    return new ProductLine(productLine);
  }

  static reconstitute(productLine: ProductLineJson) {
    return new ProductLine(productLine);
  }

  toJSON() {
    return {
      id: this.id,
      productId: this.productId,
      parLevel: this.parLevel,
    };
  }
}
