import client from "../../../config/db";
import { OperationResponse } from "../../types/OperationResponse";
import { UnitOfMeasurement } from "./UnitOfMeasurement";
import { UnitOfMeasurementRepository } from "./UnitOfMeasurementRepository";

export class PostgresUnitOfMeasurementRepository implements UnitOfMeasurementRepository {
  async save(unitOfMeasurement: UnitOfMeasurement): Promise<OperationResponse> {
    try {
      if (!unitOfMeasurement.isNew())
        return {
          success: false,
          error: new Error("Can't modify existing Units of Measurement"),
        };
      const data = {
        value: unitOfMeasurement.value,
      };
      await client.unitOfMeasurement.create({ data });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  async delete(unitOfMeasurement: UnitOfMeasurement): Promise<OperationResponse> {
    try {
      await client.unitOfMeasurement.delete({ where: { value: unitOfMeasurement.value } });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}
