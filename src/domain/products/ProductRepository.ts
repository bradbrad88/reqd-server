import { OperationResponse } from "../../types/OperationResponse";
import { Repository } from "../writeModel/Repository";
import Product from "./Product";

export type ProductParameters = ConstructorParameters<typeof Product>;

export abstract class ProductRepository implements Repository {
  abstract findProductById(id: string): Promise<Product>;
  abstract save(product: Product): Promise<OperationResponse>;
}
