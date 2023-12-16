import { OperationResponse } from "../../types/OperationResponse";
import { Repository } from "../writeModel/Repository";
import { UnitOfMeasurement } from "./UnitOfMeasurement";

export abstract class UnitOfMeasurementRepository implements Repository {
  abstract save(unitOfMeasurement: UnitOfMeasurement): Promise<OperationResponse>;
  abstract delete(unitOfMeasurement: UnitOfMeasurement): Promise<OperationResponse>;
}
