import client from "../../../config/db";
import { Controller } from "../../types/IController";

export const getUnitOfMeasurementController: Controller = async () => {
  const res = await client.unitOfMeasurement.findMany({});
  return res;
};
