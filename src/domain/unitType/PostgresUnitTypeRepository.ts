import client from "../../../config/db";
import { OperationResponse } from "../../types/OperationResponse";
import { UnitType } from "./UnitType";
import { UnitTypeRepository } from "./UnitTypeRepository";

export class PostgresUnitTypeRepository implements UnitTypeRepository {
  async save(unitType: UnitType): Promise<OperationResponse> {
    try {
      if (!unitType.isNew())
        return { success: false, error: new Error("Can't modify existing Unit Type") };
      const data = {
        value: unitType.value,
        plural: unitType.plural,
      };
      await client.unitType.create({ data });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  async delete(unitType: UnitType): Promise<OperationResponse> {
    try {
      await client.unitType.delete({ where: { value: unitType.value } });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}
