import { v4 as uuid } from "uuid";
import { AggregateRoot } from "../writeModel/AggregateRoot";
import { VendorRepository } from "./VendorRepository";

import type { Json, PartialBy } from "../../types/utils";

export type VendorJson = Json<Vendor>;

export default class Vendor extends AggregateRoot<VendorRepository> {
  public readonly id: string;
  private _logo!: string | null;
  private _vendorName!: string;
  private _venueId!: string | null;

  static create(vendor: PartialBy<VendorJson, "id" | "logo" | "venueId">) {
    const id = uuid();
    const data = {
      ...vendor,
      id: vendor.id || id,
      logo: vendor.logo || null,
      venueId: vendor.venueId || null,
    };
    return new Vendor(data);
  }

  static async reconstituteFromId(id: string, repository: VendorRepository) {
    return await repository.findById(id);
  }

  static reconstitute(vendor: VendorJson): Vendor {
    return new Vendor(vendor, false);
  }

  private constructor(vendor: VendorJson, isNew = true) {
    super();
    this._isNew = isNew;
    this.id = vendor.id;
    this.vendorName = vendor.vendorName;
    this.venueId = vendor.venueId;
    this.logo = vendor.logo;
  }

  get vendorName(): string {
    return this._vendorName;
  }
  set vendorName(newName: string) {
    this._vendorName = newName;
  }

  get venueId(): string | null {
    return this._venueId;
  }
  set venueId(id: string | null) {
    this._venueId = id;
  }

  get logo(): string | null {
    return this._logo || null;
  }
  set logo(logo: string | null) {
    this._logo = logo;
  }
}
