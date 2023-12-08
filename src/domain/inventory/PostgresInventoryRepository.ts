import client from "../../../config/db";
import { OperationResponse } from "../../types/OperationResponse";
import { Inventory, InventoryJson } from "./Inventory";
import { InventoryRepository } from "./InventoryRepository";

export class PostgresInventoryRepository implements InventoryRepository {
  async findById(venueId: string, productId: string): Promise<Inventory> {
    const res = await client.inventory.findUniqueOrThrow({
      where: { venueId_productId: { productId, venueId } },
    });
    const transform: InventoryJson = {
      venueId: res.venueId,
      productId: res.productId,
      defaultSupply: res.defaultVendorProductId,
    };
    return Inventory.reconstitute(transform);
  }

  async save(inventory: Inventory): Promise<OperationResponse> {
    try {
      const { venueId, productId, defaultSupply } = inventory;
      const data = { venueId, productId, defaultVendorProductId: defaultSupply };
      if (inventory.isNew()) {
        await client.inventory.create({ data });
      } else {
        await client.inventory.update({
          data,
          where: {
            venueId_productId: {
              productId: inventory.productId,
              venueId: inventory.venueId,
            },
          },
        });
      }
      return { success: true };
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  async delete(inventory: Inventory): Promise<OperationResponse> {
    try {
      await client.inventory.delete({
        where: {
          venueId_productId: { venueId: inventory.venueId, productId: inventory.productId },
        },
      });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}
