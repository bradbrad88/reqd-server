import client from "../../../config/db";
import { OperationResponse } from "../../types/OperationResponse";
import { PackageType } from "./PackageType";
import { PackageTypeRepository } from "./PackageTypeRepository";

export class PostgresPackageTypeRepository implements PackageTypeRepository {
  async save(packageType: PackageType): Promise<OperationResponse> {
    try {
      const data = {
        value: packageType.value,
        plural: packageType.plural,
      };
      if (!packageType.isNew())
        return { success: false, error: new Error("Can't modify existing Package Types") };
      await client.packageType.create({ data });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  async delete(packageType: PackageType): Promise<OperationResponse> {
    try {
      await client.packageType.delete({ where: { value: packageType.value } });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}
