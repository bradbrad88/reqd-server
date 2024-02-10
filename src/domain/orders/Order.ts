import { v4 as uuid } from "uuid";
import { Json, PartialBy } from "../../types/utils";
import { AggregateRoot } from "../writeModel/AggregateRoot";
import { OrderRepository } from "./OrderRepository";

export type OrderJson = Json<Order>;
type OrderProductJson = Json<OrderProduct>;
type OrderProductMap = Map<string, OrderProduct>;
export type OrderProductMapJson = { [key: string]: OrderProductJson };
export type SupplyDetailsJson = Json<SupplyDetails>;
type VendorSummary = {
  vendorId: string;
  productCount: number;
};

export default class Order extends AggregateRoot<OrderRepository> {
  public readonly id: string;
  public readonly venueId: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  private _products: OrderProductMap;
  public _changes: Set<string>;
  public _additions: Set<string>;
  public _deletions: Set<string>;

  static create(
    order: PartialBy<
      Omit<OrderJson, "createdAt" | "updatedAt" | "products" | "vendors">,
      "id"
    >,
    repository: OrderRepository
  ) {
    const id = order.id || uuid();
    const createdAt = new Date();
    const updatedAt = new Date();
    return new Order({ ...order, id, createdAt, updatedAt, products: {} }, repository);
  }

  static reconstitute(
    order: Omit<OrderJson, "updatedAt" | "vendors">,
    repository: OrderRepository
  ) {
    const updatedAt = new Date();
    return new Order({ ...order, updatedAt }, repository, false);
  }

  static async reconstituteById(id: string, repository: OrderRepository) {
    return await repository.findOrderById(id);
  }

  private constructor(
    order: Omit<OrderJson, "vendors">,
    repository: OrderRepository,
    isNew = true
  ) {
    super(repository);
    this._isNew = isNew;
    this.id = order.id;
    this.createdAt = order.createdAt;
    this.venueId = order.venueId;
    this.updatedAt = new Date();
    this._products = this._constructOrderProducts(order.products);
    this._changes = new Set();
    this._additions = new Set();
    this._deletions = new Set();
  }

  private _constructOrderProducts(items: OrderJson["products"]): OrderProductMap {
    return new Map(
      Object.entries(items).map(([key, value]) => [key, new OrderProduct(value)])
    );
  }

  get products(): OrderProductMapJson {
    const products = {} as OrderProductMapJson;
    for (const [key, product] of this._products.entries()) {
      products[key] = product.toJSON();
    }
    return products;
  }

  get vendors(): VendorSummary[] {
    const vendors = Array.from(this._products.entries()).reduce((map, [key, product]) => {
      const { vendorId } = product.supplyDetails;
      if (map.has(vendorId)) {
        const summary = map.get(vendorId)!;
        map.set(vendorId, { ...summary, productCount: summary.productCount + 1 });
        return map;
      }

      const summary: VendorSummary = {
        vendorId: product.supplyDetails.vendorId,
        productCount: 1,
      };

      map.set(vendorId, summary);
      return map;
    }, new Map<string, VendorSummary>());
    return Array.from(vendors.values());
  }

  setProductAmount(productId: string, quantity: number, supplyDetails?: SupplyDetailsJson) {
    if (this._products.has(productId)) {
      const product = this._products.get(productId)!;
      if (supplyDetails) product.supplyDetails = supplyDetails;
      product.quantity = quantity;
      this._markProductChanged(productId);
      return;
    }

    if (!supplyDetails)
      throw new Error(
        "Supply details missing. They are required when creating a new OrderProduct"
      );
    const orderItem = new OrderProduct({ productId, quantity, supplyDetails: supplyDetails });
    this._products.set(productId, orderItem);
    this._markProductAdded(productId);
  }

  removeProduct(productId: string) {
    this._products.delete(productId);
    this._markProductDeleted(productId);
  }

  changeSupplyDetails(productId: string, supplyDetails: SupplyDetailsJson) {
    if (!this._products.has(productId)) {
      const orderItem = new OrderProduct({ productId, quantity: 0, supplyDetails });
      this._products.set(productId, orderItem);
      this._markProductAdded(productId);
    }
    const orderItem = this._products.get(productId)!;
    this._markProductChanged(productId);
    const newSupplyDetails = new SupplyDetails(supplyDetails);
    orderItem.supplyDetails = newSupplyDetails;
  }

  private _markProductChanged(productId: string) {
    if (this._additions.has(productId)) return;
    this._changes.add(productId);
    this._deletions.delete(productId);
    this._additions.delete(productId);
  }

  private _markProductDeleted(productId: string) {
    this._deletions.add(productId);
    this._changes.delete(productId);
    this._additions.delete(productId);
  }

  private _markProductAdded(productId: string) {
    this._additions.add(productId);
    this._changes.delete(productId);
    this._deletions.delete(productId);
  }

  public toJSON(): OrderJson {
    return {
      id: this.id,
      venueId: this.venueId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      products: this.products,
      vendors: this.vendors,
    };
  }
}

class OrderProduct {
  public readonly productId: string;
  private _quantity!: number;
  private _supplyDetails!: SupplyDetails;

  constructor(orderItem: OrderProductJson) {
    const { productId, quantity } = orderItem;
    this.productId = productId;
    this.quantity = quantity;
    this.supplyDetails = new SupplyDetails(orderItem.supplyDetails);
  }

  get quantity(): number {
    return this._quantity;
  }
  set quantity(qty: number) {
    this._quantity = qty;
  }

  get supplyDetails(): SupplyDetailsJson {
    return this._supplyDetails.toJSON();
  }
  set supplyDetails(supplyDetails: SupplyDetailsJson) {
    const newSupplyDetails = new SupplyDetails(supplyDetails);
    this._supplyDetails = newSupplyDetails;
  }

  toJSON(): OrderProductJson {
    return {
      productId: this.productId,
      quantity: this.quantity,
      supplyDetails: this.supplyDetails,
    };
  }
}

class SupplyDetails {
  public readonly vendorId: string;
  public readonly vendorRangeId: string;
  public readonly packageType: string;
  public readonly packageQuantity: number;

  constructor(supplyDetails: SupplyDetailsJson) {
    const { vendorId, vendorRangeId, packageType, packageQuantity } = supplyDetails;
    this.vendorId = vendorId;
    this.vendorRangeId = vendorRangeId;
    this.packageType = packageType;
    this.packageQuantity = packageQuantity;
  }

  toJSON(): Json<SupplyDetails> {
    return Object.freeze({
      vendorId: this.vendorId,
      vendorRangeId: this.vendorRangeId,
      packageQuantity: this.packageQuantity,
      packageType: this.packageType,
    });
  }
}
