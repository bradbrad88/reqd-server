import { Json, PartialBy } from "../../types/utils";
import { AggregateRoot } from "../writeModel/AggregateRoot";
import { PreferredVendorRepository } from "./PreferredVendorRepository";

export type PreferredVendorJson = Json<PreferredVendor>;

export default class PreferredVendor extends AggregateRoot<PreferredVendorRepository> {
  public readonly venueId: string;
  public readonly vendorId: string;
  private _repName!: string | null;
  private _contactNumber!: string | null;
  private _email!: string | null;

  static create(
    preferredVendor: PartialBy<PreferredVendorJson, "repName" | "contactNumber" | "email">,
    repository: PreferredVendorRepository
  ) {
    const data = {
      ...preferredVendor,
      repName: preferredVendor.repName || null,
      contactNumber: preferredVendor.contactNumber || null,
      email: preferredVendor.email || null,
    };
    return new PreferredVendor(data, repository);
  }

  static reconstitute(
    preferredVendor: PreferredVendorJson,
    repository: PreferredVendorRepository
  ) {
    return new PreferredVendor(preferredVendor, repository, false);
  }

  static async reconstituteById(
    venueId: string,
    vendorId: string,
    repository: PreferredVendorRepository
  ) {
    return await repository.findById(venueId, vendorId);
  }

  private constructor(
    preferredVendor: PreferredVendorJson,
    repository: PreferredVendorRepository,
    isNew = true
  ) {
    super(repository);
    const { vendorId, venueId, contactNumber, repName, email } = preferredVendor;
    this._isNew = isNew;
    this.vendorId = vendorId;
    this.venueId = venueId;
    this.repName = repName;
    this.contactNumber = contactNumber;
    this.email = email;
  }

  get repName(): string | null {
    return this._repName;
  }
  set repName(repName: string | null) {
    this._repName = repName;
  }

  get contactNumber(): string | null {
    return this._contactNumber;
  }
  set contactNumber(contactNumber: string | null) {
    this._contactNumber = contactNumber;
  }

  get email(): string | null {
    return this._email;
  }
  set email(email: string | null) {
    this._email = email;
  }
}
