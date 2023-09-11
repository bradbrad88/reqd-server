import ValidationError from "../../errors/ValidationError";
import { Json } from "../../types/utils";

export type VenueAreaJson = Json<VenueArea>;

export default class VenueArea {
  public id?: string;
  public venueId: string;
  private _areaName!: string;

  constructor({ id, venueId, areaName }: VenueAreaJson) {
    this.id = id;
    this.venueId = venueId;
    this.areaName = areaName;
  }

  public get areaName(): string {
    return this._areaName;
  }

  public set areaName(name: string) {
    const validatedName = this.validateName(name);
    this._areaName = validatedName;
  }

  toJson(): VenueAreaJson {
    return {
      id: this.id,
      venueId: this.venueId,
      areaName: this.areaName,
    };
  }

  validateName(newName: string) {
    let validatedName = newName.trim();
    const minLength = 2;
    if (validatedName.length < minLength) {
      throw ValidationError.MinimumLength(validatedName, minLength);
    }
    return validatedName;
  }
}
