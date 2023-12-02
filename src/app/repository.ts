import { PostgresProductRepository } from "../domain/products/PostgresProductRepository";

export const getProductRepository = () => new PostgresProductRepository();
