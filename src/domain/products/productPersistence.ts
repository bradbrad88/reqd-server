import client from "../../../config/db";
import { v4 as uuid } from "uuid";
import {
  createProductInteractor,
  updateProductMeasureInteractor,
  updateProductNameInteractor,
  updateProductSizeInteractor,
} from "./productInteractor";
import { ProductJson } from "./Product";

export const getProductDB = async (productId: string) => {
  const foundProduct = await client.product.findFirstOrThrow({ where: { id: productId } });
  return foundProduct;
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
    include: { vendor: { select: { vendorName: true } } },
  });

  return foundProducts;
};

export const createProductDB = async (product: {
  displayName: string;
  venueId: string;
  vendorId: string;
  size?: number;
  measure?: string;
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
  updateFields: { displayName?: string; size?: number; measure?: string }
) => {
  const product = await client.product.findUniqueOrThrow({ where: { id: productId } });
  let updatedProduct: ProductJson = { ...product };
  const { measure, size, displayName } = updateFields;
  if (measure) updatedProduct = updateProductMeasureInteractor(updatedProduct, measure);
  if (size) updatedProduct = updateProductSizeInteractor(updatedProduct, size);
  if (displayName) updatedProduct = updateProductNameInteractor(updatedProduct, displayName);
  const data = {
    size: updatedProduct.size,
    measure: updatedProduct.measure,
    displayName: updatedProduct.displayName,
  };
  const res = await client.product.update({ where: { id: productId }, data });
  return res;
};
