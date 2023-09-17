import client from "../../../config/db";
import { Controller } from "../../types/IController";

export const getUnitTypeController: Controller = async () => {
  const res = await client.unitType.findMany({});
  return res;
};
