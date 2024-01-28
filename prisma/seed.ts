import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import chalk from "chalk";
import { PackageType } from "../src/domain/packageType/PackageType";
import {
  getPackageTypeRepository,
  getUnitOfMeasurementRepository,
  getUnitTypeRepository,
} from "../src/app/repository";
import { UnitOfMeasurement } from "../src/domain/unitOfMeasurement/UnitOfMeasurement";
import { UnitType } from "../src/domain/unitType/UnitType";

const client = new PrismaClient();

main();

async function main() {
  await deleteAll();
  await Promise.all([
    seedUnitTypes(),
    seedPackageTypes(),
    seedUnitOfMeasurements(),
    seedVenues(),
    seedVendors(),
  ]);
  await seedProducts();
}

async function deleteAll() {
  console.log("Deleting data...");
  await Promise.all([client.product.deleteMany({})]);
  await Promise.all([
    client.unitType.deleteMany({}),
    client.unitOfMeasurement.deleteMany({}),
    client.packageType.deleteMany({}),
    client.venue.deleteMany({}),
    client.vendor.deleteMany({}),
  ]);
  logSuccess("Data removed");
}

async function seedUnitTypes() {
  console.log("Seeding: Unit Types");
  try {
    const unitTypes = [
      { value: "bottle" },
      { value: "can" },
      { value: "keg" },
      { value: "stubby", plural: "stubbies" },
      { value: "sachet" },
      { value: "bag" },
    ];
    const promises = unitTypes.map(async ut =>
      UnitType.create(ut).save(getUnitTypeRepository())
    );
    const res = await Promise.all(promises);
    const err = res.find(res => {
      if (!res.success) return res.error;
    });
    if (err) throw err;
    logSuccess("Unit Types Succeeded");
  } catch (error) {
    console.log(error);
  }
}

async function seedPackageTypes() {
  console.log("Seeding: Package Types");
  try {
    const packageTypes = [
      { value: "carton" },
      { value: "keg" },
      { value: "box", plural: "boxes" },
      { value: "packet" },
      { value: "pallet" },
      { value: "bag" },
    ];
    const promises = packageTypes.map(async pt => {
      return PackageType.create(pt).save(getPackageTypeRepository());
    });
    const res = await Promise.all(promises);
    const err = res.find(res => {
      if (!res.success) return res.error;
    });
    if (err) throw err;
    logSuccess("Package Types Succeeded");
  } catch (error) {
    console.log(error);
  }
}

async function seedUnitOfMeasurements() {
  console.log("Seeding: Unit of Measurements");
  try {
    const unitOfMeasurements = [{ value: "mL" }, { value: "g" }, { value: "kg" }];
    const promises = unitOfMeasurements.map(async uom =>
      UnitOfMeasurement.create(uom).save(getUnitOfMeasurementRepository())
    );
    const res = await Promise.all(promises);
    const err = res.find(res => {
      if (!res.success) return res.error;
    });
    if (err) throw err;
    logSuccess("Unit of Measurements Succeeded");
  } catch (error) {
    console.log(error);
  }
}

async function seedVenues() {
  console.log("Seeding: Venues");
  try {
    const data = {
      id: "8b163e41-e417-4a1c-b7be-5c3fc6027eee",
      venueName: "My Hotel",
    };
    await client.venue.create({ data });
    logSuccess("Venues Succeeded");
  } catch (error) {
    console.log(error);
  }
}

async function seedProducts() {
  console.log("Seeding: Products");
  try {
    const data = [
      {
        id: "1eee023d-7155-43fa-9eae-92f16999ebbb",
        displayName: "Coopers Sparkling Ale",
        unitTypeId: "can",
        size: 375,
        unitOfMeasurementId: "mL",
      },
      {
        id: "7347b299-0c9b-4e3f-bf6b-c931e3fa6ad6",
        displayName: "Coopers Pale Ale",
        unitTypeId: "can",
        size: 375,
        unitOfMeasurementId: "mL",
      },
      {
        id: "75af7c82-aa4f-4afd-8476-50edafeca7e3",
        displayName: "Coke",
        unitTypeId: "can",
        size: 375,
        unitOfMeasurementId: "mL",
      },
      {
        id: "532fe532-193e-4a49-9fc8-4a077a8ece4d",
        displayName: "Sprite",
        unitTypeId: "can",
        size: 375,
        unitOfMeasurementId: "mL",
      },
      {
        id: "0c6cddc5-a036-4d36-b3fd-3681a7313d69",
        displayName: "Fanta",
        unitTypeId: "can",
        size: 375,
        unitOfMeasurementId: "mL",
      },
      {
        id: "23f81f20-a79c-4d87-b872-a2e3883ad75d",
        displayName: "Dark Roast Coffee",
        unitTypeId: "bag",
        size: 1000,
        unitOfMeasurementId: "g",
      },
      {
        id: "593b71d1-2bef-460a-a4f1-8a62f42dbcac",
        displayName: "Little Creatures Pale Ale",
        unitTypeId: "stubby",
        size: 330,
        unitOfMeasurementId: "mL",
      },
      {
        id: "d0eab38e-84a8-47b2-8834-a5621c998e4f",
        displayName: "Heineken",
        unitTypeId: "stubby",
        size: 330,
        unitOfMeasurementId: "mL",
      },
    ];
    await client.product.createMany({
      data,
    });
    logSuccess("Products succeeded");
  } catch (error) {
    console.log(error);
  }
}

async function seedVendors() {
  console.log("Seeding: Vendors");
  const data = [
    { id: "8f250d9b-027c-41ae-85bf-7542749b1b56", vendorName: "Lion Nathan" },
    { id: "2f5cfec5-6faa-4714-b9a3-4142c3bfd4c5", vendorName: "Coke" },
    { id: "f5a8084b-b504-4ac8-b77b-f7130587beba", vendorName: "Grinders" },
    { id: "8dfe62e2-c29b-4b77-8b23-6b6586e30ae0", vendorName: "Coopers" },
  ];
  try {
    await client.vendor.createMany({
      data,
    });
    logSuccess("Vendors succeeded");
  } catch (error) {
    console.log(error);
  }
}

function logSuccess(msg: string) {
  console.log(chalk.green(msg));
}
