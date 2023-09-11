import client from "../../../config/db";
import { createVendorInteractor } from "./vendorInteractor";

export const createVendorDB = async ({
  vendorName,
  venueId,
}: {
  vendorName: string;
  venueId: string;
}) => {
  const vendor = createVendorInteractor({ vendorName, venueId });
  return await client.vendor.create({ data: vendor });
};

export const getVenueVendorsDB = async ({ venueId }: { venueId: string }) => {
  const vendors = await client.vendor.findMany({ where: { venueId } });
  return vendors;
};

export const getVendorDB = async (vendorId: string) => {
  const vendor = await client.vendor.findUniqueOrThrow({ where: { id: vendorId } });
  return vendor;
};

export const deleteVendorDB = async (vendorId: string) => {
  await client.vendor.delete({ where: { id: vendorId } });
};
