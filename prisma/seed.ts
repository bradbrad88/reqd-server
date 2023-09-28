import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

main();

async function main() {
  await Promise.all([seedUnitTypes(), seedPackageTypes(), seedUnitOfMeasurements()]);
}

async function seedUnitTypes() {
  console.log("Seeding: Unit Types");
  const unitTypes = [
    { unitType: "bottle" },
    { unitType: "can" },
    { unitType: "keg" },
    { unitType: "stubby", plural: "stubbies" },
    { unitType: "sachet" },
    { unitType: "bag" },
  ];
  try {
    await client.unitType.deleteMany({});
    await client.unitType.createMany({ data: unitTypes });
    console.log("Success: Unit Types");
  } catch (error) {
    console.log(error);
  }
}

async function seedPackageTypes() {
  console.log("Seeding: Package Types");
  try {
    const packageTypes = [
      { packageType: "carton" },
      { packageType: "keg" },
      { packageType: "box", plural: "boxes" },
      { packageType: "packet" },
      { packageType: "pallet" },
      { packageType: "bag" },
    ];
    await client.packageType.deleteMany({});
    await client.packageType.createMany({ data: packageTypes });
    console.log("Success: Package Types");
  } catch (error) {
    console.log(error);
  }
}

async function seedUnitOfMeasurements() {
  console.log("Seeding: Unit of Measurements");
  try {
    const unitOfMeasurements = [
      { unitOfMeasurement: "mL" },
      { unitOfMeasurement: "g" },
      { unitOfMeasurement: "kg" },
    ];
    await client.unitOfMeasurement.deleteMany({});
    await client.unitOfMeasurement.createMany({ data: unitOfMeasurements });
    console.log("Success: Unit of Measurements");
  } catch (error) {
    console.log(error);
  }
}
