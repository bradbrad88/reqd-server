import { PostgresInventoryRepository } from "../domain/inventory/PostgresInventoryRepository";
import { PostgresPackageTypeRepository } from "../domain/packageType/PostgresPackageTypeRepository";
import { PostgresProductRepository } from "../domain/products/PostgresProductRepository";
import { PostgresUnitOfMeasurementRepository } from "../domain/unitOfMeasurement/PostgresUnitOfMeasurementRepository";
import { PostgresUnitTypeRepository } from "../domain/unitType/PostgresUnitTypeRepository";
import { PostgresVendorRangeRepository } from "../domain/vendorRange/PostgresVendorRangeRepository";
import { PostgresVendorRepository } from "../domain/vendors/PostgresVendorRepository";
import { PostgresVenueAreaRepository } from "../domain/venueAreas/PostgresVenueAreaRepository";
import { PostgresPreferredVendorRepository } from "../domain/venueVendors/PostgresPreferredVendorRepository";

export const getProductRepository = () => new PostgresProductRepository();
export const getInventoryRepository = () => new PostgresInventoryRepository();
export const getVendorRepository = () => new PostgresVendorRepository();
export const getVendorRangeRepository = () => new PostgresVendorRangeRepository();
export const getPreferredVendorRepository = () => new PostgresPreferredVendorRepository();
export const getVenueAreaRepository = () => new PostgresVenueAreaRepository();
export const getPackageTypeRepository = () => new PostgresPackageTypeRepository();
export const getUnitOfMeasurementRepository = () => new PostgresUnitOfMeasurementRepository();
export const getUnitTypeRepository = () => new PostgresUnitTypeRepository();
