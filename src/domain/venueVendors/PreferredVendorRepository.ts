import { OperationResponse } from "../../types/OperationResponse";
import { Repository } from "../writeModel/Repository";
import PreferredVendor from "./PreferredVendor";

export abstract class PreferredVendorRepository implements Repository {
  abstract findById(venueId: string, vendorId: string): Promise<PreferredVendor>;
  abstract save(preferredVendor: PreferredVendor): Promise<OperationResponse>;
  abstract delete(preferredVendor: PreferredVendor): Promise<OperationResponse>;
}
