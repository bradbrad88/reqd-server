import client from "../../../config/db";
import { createArrayOfLength } from "../../utils/array";
import { SupplyDetailsJson } from "../orders/Order";

type SupplyDetails = SupplyDetailsJson | null;

export const getOrderListByVenue = async (venueId: string) => {
  const res = await client.order.findMany({ where: { venueId } });
  const vendorList = res.flatMap(order =>
    (order.vendorSummary as { vendorId: string }[])
      .filter(vendor => vendor.vendorId)
      .map(vendor => vendor.vendorId)
  );
  const vendors = await client.vendor.findMany({ where: { id: { in: vendorList } } });
  const vendorMap = vendors.reduce((map, vendor) => {
    map.set(vendor.id, vendor);
    return map;
  }, new Map<string, (typeof vendors)[number]>());
  return res.map(({ vendorSummary, ...order }) => ({
    ...order,
    vendorSummary: (vendorSummary as { vendorId: string }[]).map(vendor => ({
      ...vendor,
      vendorName: vendorMap.get(vendor.vendorId)?.vendorName,
    })),
  }));
};

export const getOrderDetailById = async (orderId: string) => {
  const { orderProduct, ...res } = await client.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { orderProduct: true },
  });
  const vendorSummary = res.vendorSummary as { vendorId: string; productCount: number }[];
  const vendorArray = vendorSummary
    .filter(summary => summary.vendorId)
    .map(({ vendorId }) => vendorId);
  const vendors = await client.vendor.findMany({ where: { id: { in: vendorArray } } });
  const vendorMap = vendors.reduce((map, vendor) => {
    map.set(vendor.id, vendor.vendorName);
    return map;
  }, new Map<string, string>());

  const products = orderProduct.reduce((map, product) => {
    map[product.productId] = product;
    return map;
  }, {} as { [key: string]: (typeof orderProduct)[number] });

  const query = {
    ...res,
    products,
    vendorSummary: vendorSummary.map(vendor => ({
      ...vendor,
      vendorName: vendorMap.get(vendor.vendorId),
    })),
  };
  return query;
};

export const getOrderHistoryByVenue = async (
  venueId: string,
  dates: { periodStart: Date; periodEnd: Date }[],
  orderId?: string
) => {
  dates.reverse();
  const promises = dates.map(async ({ periodStart, periodEnd }) => {
    const res = await client.order.findMany({
      where: {
        AND: [
          { venueId },
          { createdAt: { gte: periodStart, lte: periodEnd } },
          { id: { not: orderId } },
        ],
      },
      select: { id: true, orderProduct: { select: { quantity: true, productId: true } } },
    });
    return res.map(res => ({ ...res, periodStart, periodEnd }));
  });
  const res = await Promise.all(promises);

  const dateMap = dates.reduce((map, date, idx) => {
    map[date.periodStart.toJSON()] = idx;
    return map;
  }, {} as { [date: string]: number });

  const productQuantities = res.reduce((map, periods) => {
    periods.forEach(period => {
      period.orderProduct.forEach(product => {
        const productMapItem = map[product.productId];
        if (!productMapItem) {
          map[product.productId] = createArrayOfLength(dates.length).map(idx => {
            if (dateMap[period.periodStart.toJSON()] === idx) {
              return {
                quantity: product.quantity,
              };
            }
            return {
              quantity: 0,
            };
          });
        } else {
          map[product.productId] = productMapItem.map((item, idx) => {
            if (dateMap[period.periodStart.toJSON()] === idx) {
              return {
                quantity: item.quantity + product.quantity,
              };
            } else {
              return item;
            }
          });
        }
      });
    });
    return map;
  }, {} as { [product: string]: Array<{ quantity: number }> });

  return {
    products: productQuantities,
    periods: dates.map(dates => [dates.periodStart, dates.periodEnd]),
  };
};

export const getVendorOrderSummary = async (
  orderId: string,
  vendorId: string,
  venueId: string
) => {
  const orderProductsPromise = client.orderProduct.findMany({
    where: { orderId, quantity: { gt: 0 } },
    include: { product: true },
  });
  const vendorPromise = client.vendor.findUniqueOrThrow({
    where: { id: vendorId },
    include: { preferredVendor: { where: { venueId } } },
  });

  const [orderProducts, { preferredVendor, ...vendorDetails }] = await Promise.all([
    orderProductsPromise,
    vendorPromise,
  ]);
  const vendor = preferredVendor[0];
  const vendorProducts = orderProducts
    .filter(product => (product.supplyDetails as SupplyDetails)?.vendorId === vendorId)
    .map(product => ({
      ...product.product,
      ...(product.supplyDetails as SupplyDetailsJson),
      quantity: product.quantity,
    }));

  const enumerables = vendorProducts.reduce(
    (obj, product) => {
      obj.packageType.add(product.packageType);
      if (product.unitOfMeasurementId) obj.unitOfMeasurement.add(product.unitOfMeasurementId);
      obj.unitType.add(product.unitTypeId);
      return obj;
    },
    {
      packageType: new Set<string>(),
      unitType: new Set<string>(),
      unitOfMeasurement: new Set<string>(),
    }
  );

  const packageTypePromise = client.packageType.findMany({
    where: { value: { in: Array.from(enumerables.packageType) } },
  });
  const unitOfMeasurementPromise = client.unitOfMeasurement.findMany({
    where: { value: { in: Array.from(enumerables.unitOfMeasurement) } },
  });
  const unitTypePromise = client.unitType.findMany({
    where: { value: { in: Array.from(enumerables.unitType) } },
  });

  const [packageTypes, unitOfMeasurementTypes, unitTypes] = await Promise.all([
    packageTypePromise,
    unitOfMeasurementPromise,
    unitTypePromise,
  ]);
  const products = vendorProducts.map(product => ({
    ...product,
    packageType: packageTypes.find(packageType => packageType.value === product.packageType),
    unitOfMeasurement: unitOfMeasurementTypes.find(
      unitOfMeasurement => unitOfMeasurement.value === product.unitOfMeasurementId
    ),
    unitType: unitTypes.find(unitType => unitType.value === product.unitTypeId),
  }));
  return { products, vendor: { ...vendor, ...vendorDetails } };
};
