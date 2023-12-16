import { OperationResponse } from "../../types/OperationResponse";
import { Repository } from "../writeModel/Repository";
import { PackageType } from "./PackageType";

export abstract class PackageTypeRepository implements Repository {
  abstract save(packageType: PackageType): Promise<OperationResponse>;
  abstract delete(packageType: PackageType): Promise<OperationResponse>;
}
