import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

main();

async function main() {
  await Promise.all([
    seedUnitTypes(),
    seedPackageTypes(),
    seedUnitOfMeasurements(),
    seedVenues(),
  ]);
}

async function seedUnitTypes() {
  console.log("Seeding: Unit Types");
  const unitTypes = [
    { value: "bottle" },
    { value: "can" },
    { value: "keg" },
    { value: "stubby", plural: "stubbies" },
    { value: "sachet" },
    { value: "bag" },
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
      { value: "carton" },
      { value: "keg" },
      { value: "box", plural: "boxes" },
      { value: "packet" },
      { value: "pallet" },
      { value: "bag" },
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
    const unitOfMeasurements = [{ value: "mL" }, { value: "g" }, { value: "kg" }];
    await client.unitOfMeasurement.deleteMany({});
    await client.unitOfMeasurement.createMany({ data: unitOfMeasurements });
    console.log("Success: Unit of Measurements");
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
    console.log("Success: Venues");
  } catch (error) {
    console.log(error);
  }
}
