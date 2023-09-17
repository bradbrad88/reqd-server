import client from "../../../config/db";
import { Controller } from "../../types/IController";

export const getPackageTypeController: Controller = async () => {
  const res = await client.packageType.findMany({});
  return res;
};
