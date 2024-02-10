import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import chalk from "chalk";
import { PackageType } from "../src/domain/packageType/PackageType";
import {
  getPackageTypeRepository,
  getUnitOfMeasurementRepository,
  getUnitTypeRepository,
  getVendorRangeRepository,
  getVenueAreaRepository,
} from "../src/app/repository";
import { UnitOfMeasurement } from "../src/domain/unitOfMeasurement/UnitOfMeasurement";
import { UnitType } from "../src/domain/unitType/UnitType";
import { VendorRange } from "../src/domain/vendorRange/VendorRange";
import VenueArea from "../src/domain/venueAreas/VenueArea";

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
  await Promise.all([seedProducts()]);
  await Promise.all([seedVendorRange(), seedVenueAreas()]);
}

async function deleteAll() {
  console.log("Deleting data...");
  await Promise.all([client.vendor.deleteMany({})]);
  await Promise.all([client.product.deleteMany({}), client.order.deleteMany({})]);
  await Promise.all([
    client.unitType.deleteMany({}),
    client.unitOfMeasurement.deleteMany({}),
    client.packageType.deleteMany({}),
    client.venue.deleteMany({}),
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
      UnitType.create(ut, getUnitTypeRepository()).save()
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
      { value: "6 pack" },
    ];
    const promises = packageTypes.map(async pt => {
      return PackageType.create(pt, getPackageTypeRepository()).save();
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
      UnitOfMeasurement.create(uom, getUnitOfMeasurementRepository()).save()
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
        id: "0cf071b4-4b72-49c7-a329-77e1eb348614",
        displayName: "Coopers XPA",
        unitTypeId: "can",
        size: 375,
        unitOfMeasurementId: "mL",
      },
      {
        id: "42be423a-b843-435d-9764-f0d2ee909fb5",
        displayName: "Coopers Session Ale",
        unitTypeId: "can",
        size: 375,
        unitOfMeasurementId: "mL",
      },
      {
        id: "fdea17a3-1498-4171-b0bc-7128f533d3a8",
        displayName: "Coopers Sparkling Ale",
        unitTypeId: "stubby",
        size: 375,
        unitOfMeasurementId: "mL",
      },
      {
        id: "e033f9da-24fb-41fb-bfe7-005acfe22136",
        displayName: "Coopers Pale Ale",
        unitTypeId: "stubby",
        size: 375,
        unitOfMeasurementId: "mL",
      },
      {
        id: "0409fa88-b264-48fe-adc5-4fe83894fe3a",
        displayName: "Coopers Australian Lager",
        unitTypeId: "stubby",
        size: 375,
        unitOfMeasurementId: "mL",
      },
      {
        id: "46dcbd39-9372-4859-ab50-8d8e3e96fa97",
        displayName: "Coopers Session Ale",
        unitTypeId: "stubby",
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
        id: "bc57b9d3-a947-42f5-93db-e9fafe4f7309",
        displayName: "Coke No Sugar",
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
      {
        id: "8ee991b3-6cec-49cd-873e-fdc9dcf400bc",
        displayName: "James Boags",
        unitTypeId: "stubby",
        size: 375,
        unitOfMeasurementId: "mL",
      },
      {
        id: "1a3cefbd-ae64-44ee-91ed-53961a68b64a",
        displayName: "Hahn Super Dry",
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
    { id: "70c7151f-6af2-4128-8dcb-c9d2ee0064f3", vendorName: "ALM" },
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

async function seedVendorRange() {
  console.log("Seeding: Vendor Range");
  const vendors = [
    {
      vendorId: "8f250d9b-027c-41ae-85bf-7542749b1b56",
      products: [
        {
          id: "a76a4b14-134b-4ddf-9e19-35b49b1e05df",
          productId: "593b71d1-2bef-460a-a4f1-8a62f42dbcac",
          packageType: "carton",
          packageQuantity: 24,
        },
        {
          id: "e62af093-522a-47f5-8654-c10649fc0a3f",
          productId: "593b71d1-2bef-460a-a4f1-8a62f42dbcac",
          packageType: "6 pack",
          packageQuantity: 6,
        },
      ],
    },
    {
      vendorId: "2f5cfec5-6faa-4714-b9a3-4142c3bfd4c5",
      products: [
        {
          id: "370b9a6e-8d91-4a0b-a565-efbfa58d25c7",
          productId: "75af7c82-aa4f-4afd-8476-50edafeca7e3",
          packageType: "carton",
          packageQuantity: 24,
        },
        {
          id: "1297d2f8-959e-4c9e-a03f-d5a27da058a4",
          productId: "532fe532-193e-4a49-9fc8-4a077a8ece4d",
          packageType: "carton",
          packageQuantity: 24,
        },
        {
          id: "b3306417-9664-4e32-9bc2-6bb8c10e9991",
          productId: "0c6cddc5-a036-4d36-b3fd-3681a7313d69",
          packageType: "carton",
          packageQuantity: 24,
        },
      ],
    },
    {
      vendorId: "70c7151f-6af2-4128-8dcb-c9d2ee0064f3",
      products: [
        {
          id: "ecd7a765-c000-4d69-b276-eec628a41e29",
          productId: "1eee023d-7155-43fa-9eae-92f16999ebbb",
          packageType: "carton",
          packageQuantity: 24,
        },
        {
          id: "2f1b407d-5a1d-42ce-a1d3-02792085510a",
          productId: "1eee023d-7155-43fa-9eae-92f16999ebbb",
          packageType: "6 pack",
          packageQuantity: 6,
        },
        {
          id: "1a2b9254-8f29-4737-9588-c0a33cbdb273",
          productId: "593b71d1-2bef-460a-a4f1-8a62f42dbcac",
          packageType: "carton",
          packageQuantity: 24,
        },
        {
          id: "03f7d886-5f68-4c66-9ca3-772e31164dee",
          productId: "593b71d1-2bef-460a-a4f1-8a62f42dbcac",
          packageType: "6 pack",
          packageQuantity: 6,
        },
        {
          id: "3e3a5d42-8b7a-43a4-b6ce-2708bdb87c6f",
          productId: "75af7c82-aa4f-4afd-8476-50edafeca7e3",
          packageType: "carton",
          packageQuantity: 24,
        },
        {
          id: "6650133c-5ba6-4d4c-9804-ab17fccc15b8",
          productId: "532fe532-193e-4a49-9fc8-4a077a8ece4d",
          packageType: "carton",
          packageQuantity: 24,
        },
      ],
    },
    {
      // Coopers
      vendorId: "8dfe62e2-c29b-4b77-8b23-6b6586e30ae0",
      products: [
        {
          id: "4923f677-d4f5-4d80-b3d2-68029f5662d4",
          productId: "7347b299-0c9b-4e3f-bf6b-c931e3fa6ad6",
          packageType: "carton",
          packageQuantity: 24,
        },
        {
          id: "15095e28-d09f-4f28-9498-77915e5517ca",
          productId: "7347b299-0c9b-4e3f-bf6b-c931e3fa6ad6",
          packageType: "6 pack",
          packageQuantity: 6,
        },
        {
          id: "c8e60930-2ffd-4386-8139-d5ed122aa7d7",
          productId: "1eee023d-7155-43fa-9eae-92f16999ebbb",
          packageType: "carton",
          packageQuantity: 24,
        },
        {
          id: "120a6529-06bf-4792-aec0-4ced6ad9f30e",
          productId: "1eee023d-7155-43fa-9eae-92f16999ebbb",
          packageType: "6 pack",
          packageQuantity: 6,
        },
        {
          id: "d97d5a38-7385-438a-9afb-7c7f24601db8",
          productId: "0cf071b4-4b72-49c7-a329-77e1eb348614",
          packageType: "carton",
          packageQuantity: 24,
        },
        {
          id: "aed2195a-3488-4ac8-a41e-958dc9f7d7f2",
          productId: "0cf071b4-4b72-49c7-a329-77e1eb348614",
          packageType: "6 pack",
          packageQuantity: 6,
        },
        {
          id: "28cf466e-5fa9-423e-9413-636d90d6dd42",
          productId: "42be423a-b843-435d-9764-f0d2ee909fb5",
          packageType: "carton",
          packageQuantity: 24,
        },
        {
          id: "a4dfd987-edb9-4160-ba3d-3696191ab0a5",
          productId: "42be423a-b843-435d-9764-f0d2ee909fb5",
          packageType: "6 pack",
          packageQuantity: 6,
        },
        {
          id: "2dcdf473-d212-46e7-b6ab-d72d525ef110",
          productId: "fdea17a3-1498-4171-b0bc-7128f533d3a8",
          packageType: "carton",
          packageQuantity: 24,
        },
        {
          id: "d3428157-9ffa-4507-aeab-c6a5c66a587a",
          productId: "fdea17a3-1498-4171-b0bc-7128f533d3a8",
          packageType: "6 pack",
          packageQuantity: 6,
        },
        {
          id: "1da988cc-233c-491e-a0c8-6daa99c69d53",
          productId: "e033f9da-24fb-41fb-bfe7-005acfe22136",
          packageType: "carton",
          packageQuantity: 24,
        },
        {
          id: "1db2be5d-0c0b-4f77-b827-885e77827e62",
          productId: "e033f9da-24fb-41fb-bfe7-005acfe22136",
          packageType: "6 pack",
          packageQuantity: 6,
        },
        {
          id: "0c13cdce-e079-48c9-a40b-bd4e3da67ac0",
          productId: "0409fa88-b264-48fe-adc5-4fe83894fe3a",
          packageType: "carton",
          packageQuantity: 24,
        },
        {
          id: "ec02bafa-d760-4f13-9e87-cfcbaed308fc",
          productId: "0409fa88-b264-48fe-adc5-4fe83894fe3a",
          packageType: "6 pack",
          packageQuantity: 6,
        },
        {
          id: "4fa78553-1d78-4dc3-8d69-8a0224def675",
          productId: "46dcbd39-9372-4859-ab50-8d8e3e96fa97",
          packageType: "carton",
          packageQuantity: 24,
        },
        {
          id: "40b29358-191d-4a17-a879-97fd21e9cef5",
          productId: "46dcbd39-9372-4859-ab50-8d8e3e96fa97",
          packageType: "6 pack",
          packageQuantity: 6,
        },
      ],
    },
  ];
  const repo = getVendorRangeRepository();
  await Promise.all(
    vendors.map(async vendor => {
      await Promise.all(
        vendor.products.map(async product => {
          const vendorRange = VendorRange.create(
            {
              id: product.id,
              vendorId: vendor.vendorId,
              packageType: product.packageType,
              packageQuantity: product.packageQuantity,
              productId: product.productId,
            },
            repo
          );
          await vendorRange.save();
        })
      );
    })
  );

  logSuccess("Vendor Range Succeeded");
}

async function seedVenueAreas() {
  console.log("Seeding: Venue Areas");
  const repo = getVenueAreaRepository();
  const areas = [
    {
      areaName: "Sports Bar",
      spaces: [
        {
          storageName: "Fridge",
          productLines: [
            [
              [
                "7347b299-0c9b-4e3f-bf6b-c931e3fa6ad6",
                "1eee023d-7155-43fa-9eae-92f16999ebbb",
                "42be423a-b843-435d-9764-f0d2ee909fb5",
                "0cf071b4-4b72-49c7-a329-77e1eb348614",
              ],
              [
                "fdea17a3-1498-4171-b0bc-7128f533d3a8",
                "e033f9da-24fb-41fb-bfe7-005acfe22136",
                "0409fa88-b264-48fe-adc5-4fe83894fe3a",
                "46dcbd39-9372-4859-ab50-8d8e3e96fa97",
              ],
            ],
            [
              [
                "75af7c82-aa4f-4afd-8476-50edafeca7e3",
                "bc57b9d3-a947-42f5-93db-e9fafe4f7309",
                "532fe532-193e-4a49-9fc8-4a077a8ece4d",
                "0c6cddc5-a036-4d36-b3fd-3681a7313d69",
              ],
              [
                "593b71d1-2bef-460a-a4f1-8a62f42dbcac",
                "8ee991b3-6cec-49cd-873e-fdc9dcf400bc",
                "d0eab38e-84a8-47b2-8834-a5621c998e4f",
                "1a3cefbd-ae64-44ee-91ed-53961a68b64a",
              ],
            ],
          ],
        },
      ],
    },
  ];

  const promises = areas.map(async area => {
    const venueArea = VenueArea.create(
      { areaName: area.areaName, venueId: "8b163e41-e417-4a1c-b7be-5c3fc6027eee" },
      repo
    );
    area.spaces.forEach(space => {
      venueArea.createStorageSpace(space.storageName, "layout");
      const productSections = space.productLines;
      const sections = venueArea.setSectionCount(space.storageName, productSections.length);

      sections.forEach((sectionId, idx) => {
        const productShelves = productSections[idx];
        const shelves = venueArea.setShelfCount(
          space.storageName,
          sectionId,
          productShelves.length
        );
        shelves.forEach((shelfId, idx) => {
          const productSpots = productShelves[idx];
          const spots = venueArea.setSpotCount(
            space.storageName,
            shelfId,
            productSpots.length
          );
          spots.forEach((spotId, idx) => {
            const productId = productSpots[idx];
            venueArea.setProductLine(
              { storageSpace: space.storageName, spotId },
              { parLevel: 7, productId }
            );
          });
        });
      });
    });

    await venueArea.save();
  });

  await Promise.all(promises);
  logSuccess("Venue Areas Succeeded");
}

function logSuccess(msg: string) {
  console.log(chalk.green(msg));
}
