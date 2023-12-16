import { OperationResponse } from "../../types/OperationResponse";
import { Repository } from "../writeModel/Repository";
import { UnitType } from "./UnitType";

export abstract class UnitTypeRepository implements Repository {
  abstract save(unitType: UnitType): Promise<OperationResponse>;
  abstract delete(unitType: UnitType): Promise<OperationResponse>;
}
