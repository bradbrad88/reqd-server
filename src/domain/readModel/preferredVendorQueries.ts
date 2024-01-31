import client from "../../../config/db";

export const getPreferredVendorsByVenue = async (venueId: string) => {
  const res = await client.preferredVendor.findMany({
    where: { venueId },
    select: { vendorId: true, vendor: { select: { vendorName: true, logo: true } } },
  });
  return res.map(vendor => ({
    id: vendor.vendorId,
    vendorName: vendor.vendor.vendorName,
    logo: vendor.vendor.logo,
  }));
};
