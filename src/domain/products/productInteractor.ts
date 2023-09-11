import Product from "./Product";
import type { ProductJson } from "./Product";

export const createProductInteractor = ({
  displayName,
  venueId,
  vendorId,
  measure,
  size,
}: ProductJson) => {
  const product = new Product({ displayName, venueId, vendorId, measure, size });
  return product.toJson();
};

export const updateProductNameInteractor = (currentProduct: ProductJson, newName: string) => {
  const product = new Product(currentProduct);
  product.displayName = newName;
  return product.toJson();
};

export const updateProductSizeInteractor = (currentProduct: ProductJson, newSize: number) => {
  const product = new Product(currentProduct);
  product.size = newSize;
  return product.toJson();
};

export const updateProductMeasureInteractor = (
  currentProduct: ProductJson,
  newMeasure: string
) => {
  const product = new Product(currentProduct);
  product.measure = newMeasure;
  return product.toJson();
};
