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
        unitOfMeasurementId: product.unitOfMeasurement,
        unitTypeId: product.unitType,
        size: product.size,
      };
      let res;
      if (product.isNew()) {
        await client.product.create({ data });
      } else {
        await client.product.update({ data, where: { id: product.id } });
      }
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  async delete(product: Product): Promise<OperationResponse> {
    try {
      await client.product.delete({ where: { id: product.id } });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  async findProductById(id: string): Promise<Product> {
    const res = await client.product.findUniqueOrThrow({ where: { id } });
    const transform = {
      ...res,
      unitOfMeasurement: res.unitOfMeasurementId,
      unitType: res.unitTypeId,
    };
    return Product.reconstitute(transform, this);
  }
}
