import { z } from "zod";
import { Router } from "express";
import { Controller, ControllerAdaptor } from "../../../types/IController";
import { getVenueAreaRepository } from "../../repository";
import VenueArea from "../../../domain/venueAreas/VenueArea";
import { getVenueAreaById, getVenueAreas } from "../../../domain/readModel";

const repo = getVenueAreaRepository();

const createArea: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string() });
  const bodySchema = z.object({ areaName: z.string() });
  const { venueId } = paramsSchema.parse(req.params);
  const { areaName } = bodySchema.parse(req.body);
  const venueArea = VenueArea.create({ venueId, areaName });
  const res = await venueArea.save(repo);
  if (!res.success) throw res.error;
  console.log("Why");
  return res;
};

const removeArea: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  const res = await venueArea.delete(repo);
  if (!res.success) throw res.error;
  return res;
};

const createStorageSpace: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const bodySchema = z.object({ storageSpace: z.string() });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const { storageSpace } = bodySchema.parse(req.body);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  venueArea.createStorageSpace(storageSpace);
  venueArea.setSectionCount(storageSpace, 1);
  venueArea.setShelfCount(storageSpace, 0, 1);
  const res = await venueArea.save(repo);
  if (!res.success) throw res.error;
  return res;
};

const setSectionCount: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const bodySchema = z.object({ storageSpace: z.string(), sectionCount: z.number() });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const { storageSpace, sectionCount } = bodySchema.parse(req.body);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  venueArea.setSectionCount(storageSpace, sectionCount);
  const res = await venueArea.save(repo);
  if (!res.success) throw res.error;
  return res;
};

const setShelfCount: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const bodySchema = z.object({
    storageSpace: z.string(),
    section: z.number(),
    shelfCount: z.number(),
  });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const { storageSpace, section, shelfCount } = bodySchema.parse(req.body);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  venueArea.setShelfCount(storageSpace, section, shelfCount);
  const res = await venueArea.save(repo);
  if (!res.success) throw res.error;
  return res;
};

const addSpot: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const bodySchema = z.object({
    storageSpace: z.string(),
    section: z.number(),
    shelf: z.number(),
    spot: z.object({
      parLevel: z.number().optional(),
      columnSpan: z.number().optional(),
    }),
  });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const { spot, ...location } = bodySchema.parse(req.body);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  venueArea.addSpot(location, spot);
  const res = await venueArea.save(repo);
  if (!res.success) throw res.error;
  return res;
};

const updateSpot: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const bodySchema = z.object({
    storageSpace: z.string(),
    section: z.number(),
    shelf: z.number(),
    spot: z.number(),
    update: z.object({
      parLevel: z.number().optional(),
      columnSpan: z.number().optional(),
      productId: z.string().nullish(),
    }),
  });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const { update, ...location } = bodySchema.parse(req.body);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  if (update.columnSpan !== undefined)
    venueArea.changeSpotColumnSpan(location, update.columnSpan);
  if (update.parLevel !== undefined) venueArea.changeSpotParLevel(location, update.parLevel);
  if (update.productId !== undefined) venueArea.changeSpotProduct(location, update.productId);
  const res = await venueArea.save(repo);
  if (!res.success) throw res.error;
  return res;
};

const getVenueAreaListController: Controller = async req => {
  const paramsSchema = z.object({ venueId: z.string() });
  const { venueId } = paramsSchema.parse(req.params);
  const areas = await getVenueAreas(venueId);
  return areas;
};

const getVenueAreaDetailController: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const area = await getVenueAreaById(venueAreaId);
  return area;
};

export const getAreaCommandRoutes = (controllerAdaptor: ControllerAdaptor) => {
  const router = Router({ mergeParams: true });
  router.post("/", controllerAdaptor(createArea));
  router.delete("/:venueAreaId", controllerAdaptor(removeArea));
  router.post("/:venueAreaId", controllerAdaptor(createStorageSpace));
  router.put("/:venueAreaId/section-count", controllerAdaptor(setSectionCount));
  router.put("/:venueAreaId/shelf-count", controllerAdaptor(setShelfCount));
  router.post("/:venueAreaId/spot", controllerAdaptor(addSpot));
  router.put("/:venueAreaId/spot", controllerAdaptor(updateSpot));
  return router;
};

export const getAreaQueryRoutes = (controllerAdaptor: ControllerAdaptor) => {
  const router = Router({ mergeParams: true });
  router.get("/list", controllerAdaptor(getVenueAreaListController));
  router.get("/detail/:venueAreaId", controllerAdaptor(getVenueAreaDetailController));
  return router;
};
