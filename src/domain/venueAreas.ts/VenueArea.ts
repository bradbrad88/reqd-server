import ValidationError from "../../errors/ValidationError";
import { Json, PartialBy } from "../../types/utils";
import ProductLocation, { ProductLocationJson } from "./ProductLocation";

export type VenueAreaJson = PartialBy<Json<VenueArea>, "productLocations">;

export default class VenueArea {
  public id?: string;
  public venueId: string;
  private _areaName!: string;
  private _productLocations: ProductLocation[];

  constructor({ id, venueId, areaName, productLocations = [] }: VenueAreaJson) {
    this.id = id;
    this.venueId = venueId;
    this.areaName = areaName;
    this._productLocations = productLocations.map(pl => new ProductLocation(pl));
  }

  public get areaName(): string {
    return this._areaName;
  }

  public set areaName(name: string) {
    const validatedName = this.validateName(name);
    this._areaName = validatedName;
  }

  public get productLocations(): ProductLocationJson[] {
    return this._productLocations.map(pl => ({
      ...pl.toJson(),
      isNew: pl._isNew,
      isUpdated: pl._isUpdated,
    }));
  }

  public getNewProductLocations(): (ProductLocationJson & { areaId: string })[] {
    return this._productLocations
      .filter(pl => pl._isNew)
      .map(pl => ({ ...pl.toJson(), areaId: this.id! }));
  }

  public getUpdatedProductLocations(): ProductLocationJson[] {
    return this._productLocations.filter(pl => pl._isUpdated).map(pl => pl.toJson());
  }

  addProductLocation(productLocation: PartialBy<ProductLocationJson, "sortedOrder">) {
    const sortedOrder = productLocation.sortedOrder || this._productLocations.length;
    const newLocation = new ProductLocation({ ...productLocation, sortedOrder });
    this._productLocations.push(newLocation);
    if (productLocation.sortedOrder) this.setSortedOrder();
  }

  reorderProductLocation(id: string, sortedLocation: number) {
    const productIndex = this._productLocations.findIndex(pl => pl.id === id);
    if (productIndex === -1) throw new Error("Product Location ID not found");
    if (productIndex === sortedLocation)
      throw new Error("New location is the same as old location");
    const productLocation = this._productLocations[productIndex];

    const temp = this._productLocations[sortedLocation];
    if (!temp) throw new Error("New location is outside Product Locations array length");
    this._productLocations[sortedLocation] = productLocation;
    this._productLocations[productIndex] = temp;
    this.setSortedOrder();
  }

  private setSortedOrder() {
    this._productLocations.forEach((productLocation, idx) => {
      productLocation.sortedOrder = idx;
    });
  }

  removeProductLocation(id: string) {
    const productIndex = this._productLocations.findIndex(
      productLocation => productLocation.id === id
    );
    if (productIndex === -1) throw new Error("Product Location ID not found");
    this._productLocations.splice(productIndex, 1);
    this.setSortedOrder();
  }

  setParLevel(productLocationId: string, parLevel: number | null) {
    const productLocation = this._getProductLocation(productLocationId);
    productLocation.parLevel = parLevel;
    return productLocation.toJson();
  }

  private _getProductLocation(productLocationId: string) {
    const productLocation = this._productLocations.find(pl => pl.id === productLocationId);
    if (!productLocation) throw new Error("Product Location not found");
    return productLocation;
  }

  toJson(): VenueAreaJson {
    return {
      id: this.id,
      venueId: this.venueId,
      areaName: this.areaName,
      productLocations: this._productLocations,
    };
  }

  validateName(newName: string) {
    let validatedName = newName.trim();
    const minLength = 2;
    if (validatedName.length < minLength) {
      throw ValidationError.MinimumLength(validatedName, minLength);
    }
    return validatedName;
  }
}
