import { OperationResponse } from "../../types/OperationResponse";
import { Repository } from "../writeModel/Repository";
import { VendorRange } from "./VendorRange";

export abstract class VendorRangeRepository implements Repository {
  abstract findById(id: string): Promise<VendorRange>;
  abstract save(aggregate: VendorRange): Promise<OperationResponse>;
  abstract delete(vendorRange: VendorRange): Promise<OperationResponse>;
}
