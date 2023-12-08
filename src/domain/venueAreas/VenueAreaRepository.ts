import { OperationResponse } from "../../types/OperationResponse";
import { Repository } from "../writeModel/Repository";
import VenueArea from "./VenueArea";

export abstract class VenueAreaRepository implements Repository {
  abstract findById(id: string): Promise<VenueArea>;
  abstract save(venueArea: VenueArea): Promise<OperationResponse>;
}
