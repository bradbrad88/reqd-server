import Product from "./Product";
import type { ProductJson } from "./Product";

export const createProductInteractor = ({
  displayName,
  venueId,
  vendorId,
  unitType,
  packageType,
  packageQuantity,
  unitOfMeasurement,
  size,
}: ProductJson) => {
  const product = new Product({
    displayName,
    venueId,
    vendorId,
    unitType,
    packageType,
    packageQuantity,
    unitOfMeasurement,
    size,
  });
  return product.toJson();
};

export const updateProductNameInteractor = (currentProduct: ProductJson, newName: string) => {
  const product = new Product(currentProduct);
  product.displayName = newName;
  return product.toJson();
};

export const updateProductUnitTypeInteractor = (
  currentProduct: ProductJson,
  unitType: string
) => {
  const product = new Product(currentProduct);
  product.unitType = unitType;
  return product.toJson();
};

export const updateProductPackageTypeInteractor = (
  currentProduct: ProductJson,
  packageType: string
) => {
  const product = new Product(currentProduct);
  product.packageType = packageType;
  return product.toJson();
};

export const updateProductPackageQuantityInteractor = (
  currentProduct: ProductJson,
  packageQuantity: number
) => {
  const product = new Product(currentProduct);
  product.packageQuantity = packageQuantity;
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
  product.unitOfMeasurement = newMeasure;
  return product.toJson();
};

export const updateProductVendorInteractor = (
  currentProduct: ProductJson,
  vendorId: string | null
) => {
  const product = new Product(currentProduct);
  product.vendorId = vendorId;
  return product.toJson();
};
