import client from "../../../config/db";
import { Controller } from "../../types/IController";

export const getUnitTypeController: Controller = async () => {
  const res = await client.unitType.findMany({});
  return res.map(unitType => ({
    unitType: unitType.unitType,
    plural: unitType.plural || unitType.unitType + "s",
  }));
};
