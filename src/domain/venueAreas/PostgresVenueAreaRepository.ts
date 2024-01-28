import client from "../../../config/db";
import { OperationResponse } from "../../types/OperationResponse";
import VenueArea, { VenueAreaJson } from "./VenueArea";
import { VenueAreaRepository } from "./VenueAreaRepository";

export class PostgresVenueAreaRepository implements VenueAreaRepository {
  async findById(id: string): Promise<VenueArea> {
    const res = await client.venueArea.findUniqueOrThrow({ where: { id } });
    const transform: VenueAreaJson = {
      id: res.id,
      areaName: res.areaName,
      venueId: res.venueId,
      storageSpaces: res.storageSpaces as VenueAreaJson["storageSpaces"],
      currentIdSequence: res.currentIdSequence,
      productLines: res.productLines as VenueAreaJson["productLines"],
      storageSpaceLayout: res.storageSpaceLayout as VenueAreaJson["storageSpaceLayout"],
    };
    return VenueArea.reconstitute(transform);
  }

  async save(venueArea: VenueArea): Promise<OperationResponse> {
    try {
      const data = {
        id: venueArea.id,
        venueId: venueArea.venueId,
        areaName: venueArea.areaName,
        storageSpaces: venueArea.storageSpaces,
        storageSpaceLayout: venueArea.storageSpaceLayout,
        productLines: venueArea.productLines,
        currentIdSequence: venueArea.currentIdSequence,
      };
      if (venueArea.isNew()) {
        await client.venueArea.create({ data });
      } else {
        await client.venueArea.update({ data, where: { id: venueArea.id } });
      }
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  async delete(venueArea: VenueArea): Promise<OperationResponse> {
    try {
      await client.venueArea.delete({ where: { id: venueArea.id } });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}
