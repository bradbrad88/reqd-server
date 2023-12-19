import client from "../../../config/db";

export const getUnitTypesQuery = async () => {
  return await client.unitType.findMany();
};

export const getPackageTypesQuery = async () => {
  return await client.packageType.findMany();
};

export const getUnitOfMeasurementsQuery = async () => {
  return await client.unitOfMeasurement.findMany();
};
