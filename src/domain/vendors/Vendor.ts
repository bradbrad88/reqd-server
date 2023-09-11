import { Json } from "../../types/utils";

export type VendorJson = Json<Vendor>;

export default class Vendor {
  public id?: string;
  public vendorName: string;
  public venueId: string;
  public repName?: string;
  public contactNumber?: string;
  constructor({ id, vendorName, venueId, repName }: VendorJson) {
    this.id = id;
    this.vendorName = vendorName;
    this.venueId = venueId;
    this.repName = repName;
    this.contactNumber = this.contactNumber;
  }
}
