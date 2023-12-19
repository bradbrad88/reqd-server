import { OperationResponse } from "../../types/OperationResponse";
import { Repository } from "../writeModel/Repository";
import Vendor from "./Vendor";

export abstract class VendorRepository implements Repository {
  abstract findById(id: string): Promise<Vendor>;
  abstract save(vendor: Vendor): Promise<OperationResponse>;
  abstract delete(vendor: Vendor): Promise<OperationResponse>;
}
