import client from "../../../config/db";
import { OperationResponse } from "../../types/OperationResponse";
import PreferredVendor from "./PreferredVendor";
import { PreferredVendorRepository } from "./PreferredVendorRepository";

export class PostgresPreferredVendorRepository implements PreferredVendorRepository {
  async findById(venueId: string, vendorId: string): Promise<PreferredVendor> {
    const res = await client.preferredVendor.findUniqueOrThrow({
      where: { vendorId_venueId: { vendorId, venueId } },
    });
    return PreferredVendor.reconstitute(res);
  }

  async save(preferredVendor: PreferredVendor): Promise<OperationResponse> {
    try {
      const { vendorId, venueId, contactNumber, repName, email } = preferredVendor;
      const data = {
        vendorId,
        venueId,
        contactNumber,
        repName,
        email,
      };
      if (preferredVendor.isNew()) {
        await client.preferredVendor.create({ data });
      } else {
        await client.preferredVendor.update({
          data,
          where: { vendorId_venueId: { venueId, vendorId } },
        });
      }
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  async delete(preferredVendor: PreferredVendor): Promise<OperationResponse> {
    try {
      await client.preferredVendor.delete({
        where: {
          vendorId_venueId: {
            venueId: preferredVendor.venueId,
            vendorId: preferredVendor.vendorId,
          },
        },
      });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}
