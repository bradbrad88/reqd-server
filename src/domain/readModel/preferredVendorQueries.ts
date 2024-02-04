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

export const getPreferredVendorDetail = async (vendorId: string, venueId: string) => {
  const res = await client.preferredVendor.findUniqueOrThrow({
    where: { vendorId_venueId: { vendorId, venueId } },
    include: { vendor: true },
  });
  return {
    id: res.vendorId,
    vendorName: res.vendor.vendorName,
    logo: res.vendor.logo,
    repName: res.repName,
    contactNumber: res.contactNumber,
    email: res.email,
  };
};
