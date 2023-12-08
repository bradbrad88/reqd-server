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
    };
    return VenueArea.create(transform);
  }

  async save(venueArea: VenueArea): Promise<OperationResponse> {
    try {
      const data = {
        id: venueArea.id,
        venueId: venueArea.venueId,
        areaName: venueArea.areaName,
        storageSpaces: venueArea.storageSpaces,
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
}