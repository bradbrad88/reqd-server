import type { Json } from "../../types/utils";

export type VenueJson = Json<Venue>;

export default class Venue {
  private _venueName!: string;
  public id?: string;

  public get venueName(): string {
    return this._venueName;
  }
  public set venueName(venueName: string) {
    const validatedName = this.validateVenueName(venueName);
    this._venueName = validatedName;
  }

  constructor({ venueName, id }: VenueJson) {
    this.validateVenueName(venueName);
    this.venueName = venueName;
    this.id = id;
  }

  private validateVenueName(venueName: string): string {
    const minLength = 2;
    if (venueName.length < minLength) {
      throw new Error(
        `New venue name '${venueName}' is too short. Please use at least ${minLength} characters`
      );
    }
    const trimmedName = venueName.trim();
    const regex = /[\n]/g;
    if (regex.test(trimmedName)) {
      throw new Error(`Venue name cannot contain new-line characters`);
    }
    return trimmedName;
  }
}
