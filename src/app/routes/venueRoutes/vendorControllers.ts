import { z } from "zod";
import { Router } from "express";
import { Controller, ControllerAdaptor } from "../../../types/IController";
import PreferredVendor from "../../../domain/preferredVendors/PreferredVendor";
import { getPreferredVendorRepository } from "../../repository";
import {
  getPreferredVendorDetail,
  getPreferredVendorsByVenue,
} from "../../../domain/readModel";
import { getGlobalVendors } from "../../../domain/readModel/vendorQueries";

const repo = getPreferredVendorRepository();

const addVendor: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string() });
  const bodySchema = z.object({
    vendorId: z.string(),
    contactNumber: z.string().nullish(),
    repName: z.string().nullish(),
    email: z.string().nullish(),
  });
  const { venueId } = paramsSchema.parse(req.params);
  const { vendorId, contactNumber, repName, email } = bodySchema.parse(req.body);
  const preferredVendor = PreferredVendor.create({
    venueId,
    vendorId,
    contactNumber,
    repName,
  });
  const res = await preferredVendor.save(repo);
  if (!res.success) throw res.error;
  return res;
};

const removeVendor: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string(), vendorId: z.string() });
  const { vendorId, venueId } = paramsSchema.parse(req.params);
  const preferredVendor = await PreferredVendor.reconstituteById(venueId, vendorId, repo);
  const res = await preferredVendor.delete(repo);
  if (!res.success) throw res.error;
  return res;
};

const updateVendor: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string(), vendorId: z.string() });
  const bodySchema = z.object({
    repName: z.string().nullish(),
    contactNumber: z.string().nullish(),
    email: z.string().nullish(),
  });
  const { vendorId, venueId } = paramsSchema.parse(req.params);
  const { repName, contactNumber, email } = bodySchema.parse(req.body);
  const preferredVendor = await PreferredVendor.reconstituteById(venueId, vendorId, repo);
  if (repName !== undefined) preferredVendor.repName = repName;
  if (contactNumber !== undefined) preferredVendor.contactNumber = contactNumber;
  if (email !== undefined) preferredVendor.email = email;
  const res = await preferredVendor.save(repo);
  if (!res.success) throw res.error;
  return res;
};

const getPreferredVendorList: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string() });
  const { venueId } = paramsSchema.parse(req.params);
  const res = await getPreferredVendorsByVenue(venueId);
  return res;
};

const getPreferredVendorDetailController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string(), vendorId: z.string() });
  const { vendorId, venueId } = paramsSchema.parse(req.params);
  const vendor = await getPreferredVendorDetail(vendorId, venueId);
  return vendor;
};

const getGlobalVendorList: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string() });
  const querySchema = z.object({ query: z.string().optional() });
  const { venueId } = paramsSchema.parse(req.params);
  const filters = querySchema.parse(req.query);
  const res = await getGlobalVendors(venueId, filters);
  return res;
};

export const getPreferredVendorCommandRoutes = (controllerAdaptor: ControllerAdaptor) => {
  const router = Router({ mergeParams: true });
  router.post("/", controllerAdaptor(addVendor));
  router.delete("/:vendorId", controllerAdaptor(removeVendor));
  router.put("/:vendorId", controllerAdaptor(updateVendor));
  return router;
};

export const getPreferredVendorQueryRoutes = (controllerAdaptor: ControllerAdaptor) => {
  const router = Router({ mergeParams: true });
  router.get("/list", controllerAdaptor(getPreferredVendorList));
  router.get("/detail/:vendorId", controllerAdaptor(getPreferredVendorDetailController));
  router.get("/global/list", controllerAdaptor(getGlobalVendorList));
  return router;
};
