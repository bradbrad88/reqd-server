import client from "../../../config/db";
import { OperationResponse } from "../../types/OperationResponse";
import { VendorRange } from "./VendorRange";
import { VendorRangeRepository } from "./VendorRangeRepository";

export class PostgresVendorRangeRepository implements VendorRangeRepository {
  async save(vendorRange: VendorRange): Promise<OperationResponse> {
    try {
      const data = {
        id: vendorRange.id,
        vendorId: vendorRange.vendorId,
        productId: vendorRange.productId,
        packageTypeId: vendorRange.packageType,
        packageQuantity: vendorRange.packageQuantity,
      };
      if (vendorRange.isNew()) {
        await client.vendorRange.create({ data });
      } else {
        await client.vendorRange.update({ data, where: { id: vendorRange.id } });
      }
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  async findById(id: string): Promise<VendorRange> {
    const res = await client.vendorRange.findUniqueOrThrow({ where: { id } });
    const transform = {
      id: res.id,
      vendorId: res.vendorId,
      productId: res.productId,
      packageType: res.packageTypeId,
      packageQuantity: res.packageQuantity,
    };
    return VendorRange.reconstitute(transform);
  }

  async delete(vendorRange: VendorRange): Promise<OperationResponse> {
    try {
      await client.vendorRange.delete({ where: { id: vendorRange.id } });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}
