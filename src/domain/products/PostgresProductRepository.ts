import client from "../../../config/db";
import { OperationResponse } from "../../types/OperationResponse";
import Product from "./Product";
import { ProductRepository } from "./ProductRepository";

export class PostgresProductRepository implements ProductRepository {
  async save(product: Product): Promise<OperationResponse> {
    try {
      const data = {
        id: product.id,
        displayName: product.displayName,
        venueId: product.venueId,
        vendorId: product.vendorId,
        packageTypeId: product.packageType,
        unitOfMeasurementId: product.unitOfMeasurement,
        unitTypeId: product.unitType,
        packageQuantity: product.packageQuantity,
        size: product.size,
      };
      let res;
      if (product.isNew()) {
        res = await client.product.create({ data });
      } else {
        res = await client.product.update({ data, where: { id: product.id } });
      }
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  // async findUnitType(id: string): Promise<{ value: string; plural?: string | undefined }> {}

  async findProductById(id: string): Promise<Product> {
    const res = await client.product.findUniqueOrThrow({ where: { id } });
    const transform = {
      ...res,
      packageType: res.packageTypeId,
      unitOfMeasurement: res.unitOfMeasurementId,
      unitType: res.unitTypeId,
    };
    return new Product(transform, false);
  }
}
