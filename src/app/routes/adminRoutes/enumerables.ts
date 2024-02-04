import { z } from "zod";
import { Router } from "express";
import { Controller, ControllerAdaptor } from "../../../types/IController";
import { PackageType } from "../../../domain/packageType/PackageType";
import {
  getPackageTypeRepository,
  getUnitOfMeasurementRepository,
  getUnitTypeRepository,
} from "../../repository";
import { UnitType } from "../../../domain/unitType/UnitType";
import { UnitOfMeasurement } from "../../../domain/unitOfMeasurement/UnitOfMeasurement";

const addPackageType: Controller = async req => {
  const repo = getPackageTypeRepository();
  const bodyParams = z.object({ value: z.string(), plural: z.string().optional() });
  const data = bodyParams.parse(req.body);
  const packageType = PackageType.create(data, repo);
  const res = await packageType.save();
  if (!res.success) throw res.error;
};

const addUnitType: Controller = async req => {
  const repo = getUnitTypeRepository();
  const bodyParams = z.object({ value: z.string(), plural: z.string().optional() });
  const data = bodyParams.parse(req.body);
  const unitType = UnitType.create(data, repo);
  const res = await unitType.save();
  if (!res.success) throw res.error;
};

const addUnitOfMeasurement: Controller = async req => {
  const repo = getUnitOfMeasurementRepository();
  const bodyParams = z.object({ value: z.string() });
  const data = bodyParams.parse(req.body);
  const unitOfMeasurement = UnitOfMeasurement.create(data, repo);
  const res = await unitOfMeasurement.save();
  if (!res.success) throw res.error;
};

export const getAdminEnumerableCommandRoutes = (controllerAdaptor: ControllerAdaptor) => {
  const router = Router({ mergeParams: true });
  router.post("/package-types", controllerAdaptor(addPackageType));
  router.post("/unit-types", controllerAdaptor(addUnitType));
  router.post("/unit-of-measurements", controllerAdaptor(addUnitOfMeasurement));
  return router;
};
