import { Json, PartialBy } from "../../types/utils";

export type OrderJson = Json<Order>;

export default class Order {
  public id?: string | null;
  public venueId: string;
  public createdAt: Date;
  public updatedAt: Date;
  private _items: OrderItem[];

  get items(): OrderItemJson[] {
    return this._items.map(item => item.toJson());
  }

  constructor({
    id,
    createdAt,
    venueId,
    items = [],
  }: PartialBy<PartialBy<OrderJson, "items">, "updatedAt">) {
    this.id = id;
    this.createdAt = createdAt;
    this.venueId = venueId;
    this.updatedAt = new Date();
    this._items = items.map(
      item => new OrderItem({ productId: item.productId, areaAmounts: item.areaAmounts })
    );
  }

  setItemAmount(productId: string, areaId: string, amount: number) {
    const product = this.getOrCreateProducts(productId);
    product.setAreaAmount(areaId, amount);
  }

  removeProduct(productId: string) {
    const idx = this._items.findIndex(item => item.productId === productId);
    this._items.splice(idx, 1);
  }

  private getOrCreateProducts(productId: string) {
    const itemArea = this._items.find(item => item.productId === productId);
    if (itemArea) return itemArea;

    const newOrderItem = new OrderItem({ productId });
    this._items.push(newOrderItem);
    return newOrderItem;
  }

  public toJson(): OrderJson {
    return {
      id: this.id,
      venueId: this.venueId,
      createdAt: this.createdAt,
      updatedAt: new Date(),
      items: this.items,
    };
  }
}

type OrderItemJson = Json<OrderItem>;

class OrderItem {
  public productId: string;
  private _areaAmounts: AreaAmount[];

  public get areaAmounts() {
    return this._areaAmounts.map(areaAmount => areaAmount.toJson());
  }

  constructor({
    productId,
    areaAmounts = [],
  }: PartialBy<PartialBy<OrderItemJson, "areaAmounts">, "totalAmount">) {
    this.productId = productId;
    this._areaAmounts = areaAmounts.map(
      ({ areaId, amount }) => new AreaAmount(areaId, amount)
    );
  }

  setAreaAmount(areaId: string, amount: number) {
    const areaAmount = this._areaAmounts.find(a => a.areaId === areaId);
    if (!areaAmount) {
      return this.createNewAreaAmount(areaId, amount);
    }
    areaAmount.amount = amount;
  }

  createNewAreaAmount(areaId: string, amount: number) {
    const newAreaAmount = new AreaAmount(areaId, amount);
    this._areaAmounts.push(newAreaAmount);
  }

  get totalAmount(): number {
    return this._areaAmounts.reduce((total, areaAmount) => areaAmount.amount + total, 0);
  }

  toJson(): OrderItemJson {
    return {
      productId: this.productId,
      areaAmounts: this.areaAmounts,
      totalAmount: this.totalAmount,
    };
  }
}

type AreaAmountJson = Json<AreaAmount>;

class AreaAmount {
  constructor(public areaId: string, public amount: number) {}

  toJson(): AreaAmountJson {
    return {
      areaId: this.areaId,
      amount: this.amount,
    };
  }
}
