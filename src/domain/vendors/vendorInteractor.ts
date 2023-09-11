import Vendor from "./Vendor";
import type { VendorJson } from "./Vendor";

export const createVendorInteractor = (newVendor: VendorJson) => {
  const vendor = new Vendor(newVendor);
  return vendor;
};
