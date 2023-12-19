import { Router } from "express";
import { Controller, ControllerAdaptor } from "../../../types/IController";
import {
  getPackageTypesQuery,
  getUnitOfMeasurementsQuery,
  getUnitTypesQuery,
} from "../../../domain/readModel/enumerablesQueries";

const getUnitTypes: Controller = async req => {
  return await getUnitTypesQuery();
};

const getPackageTypes: Controller = async req => {
  return await getPackageTypesQuery();
};

const getUnitOfMeasurements: Controller = async req => {
  return await getUnitOfMeasurementsQuery();
};

export const getEnumerablesGlobalQueryControllers = (controllerAdaptor: ControllerAdaptor) => {
  const router = Router();
  router.get("/unit-types", controllerAdaptor(getUnitTypes));
  router.get("/package-types", controllerAdaptor(getPackageTypes));
  router.get("/unit-of-measurements", controllerAdaptor(getUnitOfMeasurements));
  return router;
};
