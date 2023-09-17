import client from "../../../config/db";
import { v4 as uuid } from "uuid";
import {
  createProductInteractor,
  updateProductMeasureInteractor,
  updateProductNameInteractor,
  updateProductPackageQuantityInteractor,
  updateProductPackageTypeInteractor,
  updateProductSizeInteractor,
  updateProductUnitTypeInteractor,
  updateProductVendorInteractor,
} from "./productInteractor";
import { ProductJson } from "./Product";

export const getProductDB = async (productId: string) => {
  const prod = await client.product.findFirstOrThrow({
    where: { id: productId },
    select: {
      id: true,
      vendor: true,
      displayName: true,
      unitType: true,
      packageType: true,
      packageQuantity: true,
      size: true,
      unitOfMeasurement: true,
    },
  });
  const returnProduct = {
    id: prod.id,
    vendorId: prod.vendor?.id,
    vendorName: prod.vendor?.vendorName,
    displayName: prod.displayName,
    unitType: prod.unitType,
    packageType: prod.packageType,
    packageQuantity: prod.packageQuantity,
    size: prod.size,
    unitOfMeasurement: prod.unitOfMeasurement,
  };
  return returnProduct;
};

type Filters = {
  vendorId?: string[];
  areaId?: string[];
  query?: string;
};

export const getVenueProductsDB = async (venueId: string, filters?: Filters) => {
  const prismaFilters = [{ venueId }] as any[];

  if (filters?.areaId) {
    prismaFilters.push({
      OR: filters.areaId.map(areaId => ({ ProductLocations: { some: { areaId } } })),
    });
  }

  if (filters?.vendorId) {
    prismaFilters.push({
      OR: filters.vendorId.map(vendorId => ({ vendorId })),
    });
  }

  if (filters?.query) {
    prismaFilters.push({
      displayName: { contains: filters.query, mode: "insensitive" },
    });
  }

  const foundProducts = await client.product.findMany({
    where: {
      AND: prismaFilters,
    },
    select: {
      id: true,
      displayName: true,
      unitType: true,
      packageType: true,
      packageQuantity: true,
      size: true,
      unitOfMeasurement: true,
      vendor: { select: { vendorName: true, id: true } },
    },
  });
  const returnProducts = foundProducts.map(product => ({
    id: product.id,
    vendorId: product.vendor?.id,
    vendorName: product.vendor?.vendorName,
    displayName: product.displayName,
    unitType: product.unitType,
    packageType: product.packageType,
    packageQuantity: product.packageQuantity,
    size: product.size,
    unitOfMeasurement: product.unitOfMeasurement,
  }));
  return returnProducts;
};

export const createProductDB = async (product: {
  venueId: string;
  vendorId: string;
  displayName: string;
  unitType: string;
  packageType: string;
  packageQuantity: number;
  size?: number;
  unitOfMeasurement?: string;
}) => {
  const newProduct = createProductInteractor({ ...product, id: uuid() });
  const savedProduct = await client.product.create({ data: newProduct });
  return savedProduct;
};

export const updateProductNameDB = async (productId: string, productName: string) => {
  const product = await client.product.findUniqueOrThrow({ where: { id: productId } });
  const updatedProduct = updateProductNameInteractor(product, productName);
  const savedProduct = await client.product.update({
    where: { id: productId },
    data: { displayName: updatedProduct.displayName },
  });
  return savedProduct;
};

export const deleteProductDB = async (productId: string) => {
  await client.product.delete({ where: { id: productId } });
};

export const updateProductDetailsDB = async (
  productId: string,
  updateFields: {
    displayName?: string;
    unitType?: string;
    packageType?: string;
    packageQuantity?: number;
    size?: number;
    unitOfMeasurement?: string;
  }
) => {
  const product = await client.product.findUniqueOrThrow({ where: { id: productId } });
  let updatedProduct: ProductJson = { ...product };
  const { displayName, unitType, packageType, packageQuantity, size, unitOfMeasurement } =
    updateFields;

  if (displayName) updatedProduct = updateProductNameInteractor(updatedProduct, displayName);
  if (unitType) updatedProduct = updateProductUnitTypeInteractor(updatedProduct, unitType);
  if (packageType)
    updatedProduct = updateProductPackageTypeInteractor(updatedProduct, packageType);
  if (packageQuantity)
    updatedProduct = updateProductPackageQuantityInteractor(updatedProduct, packageQuantity);
  if (unitOfMeasurement)
    updatedProduct = updateProductMeasureInteractor(updatedProduct, unitOfMeasurement);
  if (size) updatedProduct = updateProductSizeInteractor(updatedProduct, size);

  const data = {
    displayName: updatedProduct.displayName,
    unitType: updatedProduct.unitType,
    packageType: updatedProduct.packageType,
    packageQuantity: updatedProduct.packageQuantity,
    size: updatedProduct.size,
    unitOfMeasurement: updatedProduct.unitOfMeasurement,
  };
  const res = await client.product.update({ where: { id: productId }, data });
  return res;
};

export const updateProductVendorDB = async (productId: string, vendorId: string | null) => {
  const product = await client.product.findUniqueOrThrow({ where: { id: productId } });
  const updatedProduct = updateProductVendorInteractor(product, vendorId);
  const res = await client.product.update({
    where: { id: productId },
    data: { vendorId },
    include: { vendor: true },
  });
  return {
    id: res.id,
    venueId: res.venueId,
    vendorId: res.vendorId,
    vendorName: res.vendor?.vendorName,
    unitType: res.unitType,
    packageType: res.packageType,
    packageQuantity: res.packageQuantity,
    size: res.size,
    unitOfMeasurement: res.unitOfMeasurement,
  };
};
