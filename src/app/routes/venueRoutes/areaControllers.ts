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
  const venueArea = VenueArea.create({ venueId, areaName }, repo);
  const res = await venueArea.save();
  if (!res.success) throw res.error;
  return res;
};

const patchArea: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const bodySchema = z.object({ areaName: z.string().optional() });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const { areaName } = bodySchema.parse(req.body);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  if (areaName) venueArea.areaName = areaName;
  const res = await venueArea.save();
  if (!res.success) throw res.error;
  return res;
};

const removeArea: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  const res = await venueArea.delete();
  if (!res.success) throw res.error;
  return res;
};

const createStorageSpace: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const bodySchema = z.object({
    storageSpace: z.string(),
    layoutType: z.union([z.literal("list"), z.literal("layout")]),
  });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const { storageSpace, layoutType } = bodySchema.parse(req.body);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  venueArea.createStorageSpace(storageSpace, layoutType);
  const sections = venueArea.setSectionCount(storageSpace, 1);
  const shelves = venueArea.setShelfCount(storageSpace, sections[0], 1);
  venueArea.setSpotCount(storageSpace, shelves[0], 3);
  const res = await venueArea.save();
  if (!res.success) throw res.error;
  return res;
};

const removeStorageSpace: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const bodySchema = z.object({
    storageSpace: z.string(),
  });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const { storageSpace } = bodySchema.parse(req.body);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  venueArea.removeStorageSpace(storageSpace);
  const res = await venueArea.save();
  if (!res.success) throw res.error;
  return res;
};

const renameStorageSpace: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const bodySchema = z.object({
    storageSpace: z.string(),
    newName: z.string(),
  });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const { storageSpace, newName } = bodySchema.parse(req.body);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  venueArea.renameStorageSpace(storageSpace, newName);
  const res = await venueArea.save();
  if (!res.success) throw res.error;
  return res;
};

const moveStorageSpace: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const bodySchema = z.object({
    storageSpace: z.string(),
    newIndex: z.number().gte(0),
  });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const { storageSpace, newIndex } = bodySchema.parse(req.body);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  venueArea.moveStorageSpace(storageSpace, newIndex);
  const res = await venueArea.save();
  if (!res.success) throw res.error;
  return res;
};

const setProductLine: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const bodySchema = z.object({
    location: z.union([
      z.object({
        storageSpace: z.string(),
        spotId: z.string(),
      }),
      z.object({
        storageSpace: z.string(),
        index: z.number().int().gte(0),
      }),
    ]),
    productLine: z.object({
      productId: z.string().nullable().optional(),
      parLevel: z.number().int().gte(0).nullable().optional(),
    }),
  });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const { location, productLine } = bodySchema.parse(req.body);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  venueArea.setProductLine(location, productLine);
  const res = await venueArea.save();
  if (!res.success) throw res.error;
  return res;
};

const editProductLine: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const bodySchema = z.object({
    productLine: z.string(),
    update: z.object({
      productId: z.string().nullable().optional(),
      parLevel: z.number().int().gte(0).nullable().optional(),
    }),
  });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const { productLine, update } = bodySchema.parse(req.body);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  venueArea.editProductLine(productLine, update);
  const res = await venueArea.save();
  if (!res.success) throw res.error;
  return res;
};

const removeProductLine: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const bodySchema = z.object({
    location: z.union([
      z.object({
        storageSpace: z.string(),
        spotId: z.string(),
      }),
      z.object({
        storageSpace: z.string(),
        index: z.number().int().gte(0),
      }),
    ]),
  });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const { location } = bodySchema.parse(req.body);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  venueArea.removeProductLine(location);
  const res = await venueArea.save();
  if (!res.success) throw res.error;
  return res;
};

const setSectionCount: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const bodySchema = z.object({ storageSpace: z.string(), count: z.number() });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const { storageSpace, count } = bodySchema.parse(req.body);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  venueArea.setSectionCount(storageSpace, count);
  const res = await venueArea.save();
  if (!res.success) throw res.error;
  return res;
};

const setShelfCount: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const bodySchema = z.object({
    storageSpace: z.string(),
    sectionId: z.string(),
    count: z.number(),
  });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const { storageSpace, sectionId, count } = bodySchema.parse(req.body);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  venueArea.setShelfCount(storageSpace, sectionId, count);
  const res = await venueArea.save();
  if (!res.success) throw res.error;
  return res;
};

const setSpotCount: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const bodySchema = z.object({
    storageSpace: z.string(),
    shelfId: z.string(),
    count: z.number().int().gt(0),
  });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const { storageSpace, shelfId, count } = bodySchema.parse(req.body);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  venueArea.setSpotCount(storageSpace, shelfId, count);
  const res = await venueArea.save();
  if (!res.success) throw res.error;
  return res;
};

const moveSpot: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const bodySchema = z.object({
    storageSpace: z.string(),
    shelfId: z.string(),
    spotId: z.string(),
    index: z.number().gte(0),
  });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const { storageSpace, shelfId, spotId, index } = bodySchema.parse(req.body);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  venueArea.moveSpot(storageSpace, spotId, shelfId, index);
  const res = await venueArea.save();
  if (!res.success) throw res.error;
  return res;
};

const updateSpot: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const bodySchema = z.object({
    storageSpace: z.string(),
    spotId: z.string(),
    update: z.object({
      columnWidth: z.number().int().gte(0).optional(),
      stackHeight: z.number().int().gte(0).optional(),
    }),
  });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const { storageSpace, spotId, update } = bodySchema.parse(req.body);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  venueArea.editSpot(storageSpace, spotId, update);
  const res = await venueArea.save();
  if (!res.success) throw res.error;
  return res;
};

const removeSection: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const bodySchema = z.object({
    storageSpace: z.string(),
    sectionId: z.string(),
  });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const { storageSpace, sectionId } = bodySchema.parse(req.body);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  venueArea.removeSection(storageSpace, sectionId);
  const res = await venueArea.save();
  if (!res.success) throw res.error;
  return res;
};

const removeShelf: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const bodySchema = z.object({
    storageSpace: z.string(),
    shelfId: z.string(),
  });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const { storageSpace, shelfId } = bodySchema.parse(req.body);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  venueArea.removeShelf(storageSpace, shelfId);
  const res = await venueArea.save();
  if (!res.success) throw res.error;
  return res;
};

const removeSpot: Controller = async req => {
  const paramsSchema = z.object({ venueAreaId: z.string() });
  const bodySchema = z.object({
    storageSpace: z.string(),
    spotId: z.string(),
  });
  const { venueAreaId } = paramsSchema.parse(req.params);
  const { storageSpace, spotId } = bodySchema.parse(req.body);
  const venueArea = await VenueArea.reconstituteById(venueAreaId, repo);
  venueArea.removeSpot(storageSpace, spotId);
  const res = await venueArea.save();
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
  router.patch("/:venueAreaId", controllerAdaptor(patchArea));
  router.delete("/:venueAreaId", controllerAdaptor(removeArea));
  router.post("/:venueAreaId", controllerAdaptor(createStorageSpace));
  router.put("/:venueAreaId/remove-storage-space", controllerAdaptor(removeStorageSpace));
  router.put("/:venueAreaId/rename-storage-space", controllerAdaptor(renameStorageSpace));
  router.put("/:venueAreaId/move-storage-space", controllerAdaptor(moveStorageSpace));
  router.put("/:venueAreaId/set-product-line", controllerAdaptor(setProductLine));
  router.put("/:venueAreaId/edit-product-line", controllerAdaptor(editProductLine));
  router.put("/:venueAreaId/remove-product-line", controllerAdaptor(removeProductLine));
  router.put("/:venueAreaId/section-count", controllerAdaptor(setSectionCount));
  router.put("/:venueAreaId/shelf-count", controllerAdaptor(setShelfCount));
  router.put("/:venueAreaId/spot-count", controllerAdaptor(setSpotCount));
  router.put("/:venueAreaId/move-spot", controllerAdaptor(moveSpot));
  router.put("/:venueAreaId/update-spot", controllerAdaptor(updateSpot));
  router.put("/:venueAreaId/remove-section", controllerAdaptor(removeSection));
  router.put("/:venueAreaId/remove-shelf", controllerAdaptor(removeShelf));
  router.put("/:venueAreaId/remove-spot", controllerAdaptor(removeSpot));
  return router;
};

export const getAreaQueryRoutes = (controllerAdaptor: ControllerAdaptor) => {
  const router = Router({ mergeParams: true });
  router.get("/list", controllerAdaptor(getVenueAreaListController));
  router.get("/detail/:venueAreaId", controllerAdaptor(getVenueAreaDetailController));
  return router;
};
