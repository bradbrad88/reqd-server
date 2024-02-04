import client from "../../../config/db";
import { OperationResponse } from "../../types/OperationResponse";
import Vendor from "./Vendor";
import { VendorRepository } from "./VendorRepository";

export class PostgresVendorRepository implements VendorRepository {
  async findById(id: string): Promise<Vendor> {
    const res = await client.vendor.findUniqueOrThrow({ where: { id } });
    return Vendor.reconstitute(res, this);
  }
  async save(vendor: Vendor): Promise<OperationResponse> {
    try {
      const data = {
        id: vendor.id,
        vendorName: vendor.vendorName,
        logo: vendor.logo,
      };
      if (vendor.isNew()) {
        await client.vendor.create({ data });
      } else {
        await client.vendor.update({ data, where: { id: vendor.id } });
      }
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
  async delete(vendor: Vendor): Promise<OperationResponse> {
    try {
      await client.vendor.delete({ where: { id: vendor.id } });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}
