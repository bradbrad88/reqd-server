import { Router } from "express";
import { Controller, ControllerAdaptor } from "../../../types/IController";
import { z } from "zod";
import Vendor from "../../../domain/vendors/Vendor";
import { getVendorRangeRepository, getVendorRepository } from "../../repository";
import { VendorRange } from "../../../domain/vendorRange/VendorRange";

const vendorRepo = getVendorRepository();
const vendorRangeRepo = getVendorRangeRepository();

const addVendor: Controller = async req => {
  const bodySchema = z.object({ vendorName: z.string(), logo: z.string().nullish() });
  const { vendorName, logo } = bodySchema.parse(req.body);
  const vendor = Vendor.create({ vendorName, logo }, vendorRepo);
  const res = await vendor.save();
  if (!res.success) throw res.error;
  return res;
};

const removeVendor: Controller = async req => {
  const paramsSchema = z.object({ vendorId: z.string() });
  const { vendorId } = paramsSchema.parse(req.params);
  const vendor = await Vendor.reconstituteFromId(vendorId, vendorRepo);
  const res = await vendor.delete();
  if (!res.success) throw res.error;
  return res;
};

const addVendorRange: Controller = async req => {
  const paramsSchema = z.object({ vendorId: z.string() });
  const bodySchema = z.object({
    productId: z.string(),
    packageType: z.string(),
    packageQuantity: z.number(),
  });
  const { vendorId } = paramsSchema.parse(req.params);
  const { productId, packageQuantity, packageType } = bodySchema.parse(req.body);
  const vendorRange = VendorRange.create(
    {
      vendorId,
      productId,
      packageType,
      packageQuantity,
    },
    vendorRangeRepo
  );
  const res = await vendorRange.save();
  if (!res.success) throw res.error;
  return res;
};

const changeVendorLogo: Controller = async req => {
  const paramsSchema = z.object({ vendorId: z.string() });
  const { vendorId } = paramsSchema.parse(req.params);
  // Need a way to handle multipart request
  // Need an image service to handle resizing, taking down old image and uploading (prob s3)
  // Get back url and save to Vendor object
  // Long operation, should be handled as such
  const vendor = await Vendor.reconstituteFromId(vendorId, vendorRepo);
  // vendor.logo = // logo
  const res = await vendor.save();
  if (!res.success) throw res.error;
  return res;
};

export const getAdminVendorCommandRoutes = (controllerAdaptor: ControllerAdaptor) => {
  const router = Router({ mergeParams: true });
  router.post("/", controllerAdaptor(addVendor));
  router.delete("/:vendorId", controllerAdaptor(removeVendor));
  router.post("/:vendorId", controllerAdaptor(addVendorRange));
  return router;
};
