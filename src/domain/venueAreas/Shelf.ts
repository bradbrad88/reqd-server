import { Json, PartialBy } from "../../types/utils";
import { Spot, SpotJson } from "./Spot";
import { StorageLocation } from "./VenueArea";

export type ShelfJson = PartialBy<Json<Shelf>, "spots">;

export class Shelf {
  private _position!: number;
  private _spots: Spot[];

  constructor(shelf: ShelfJson) {
    this.position = shelf.position;
    this._spots = (shelf.spots || []).map(spot => new Spot(spot));
  }

  get position(): number {
    return this._position;
  }
  set position(position: number) {
    this._position = position;
  }

  get spots(): SpotJson[] {
    return this._spots.map(spot => spot.toJSON());
  }

  addSpot(spot: Partial<SpotJson>) {
    const newSpot = Spot.create(spot);
    this._spots.push(newSpot);
    this.applySpotPositions();
  }

  applyPosition(position: number) {
    this._position = position;
  }

  getSpot(location: StorageLocation) {
    return this._getSpot(location.spot);
  }

  removeSpot(position: number) {
    const spot = this._getSpot(position);
    this._spots.splice(position, 1);
    this.applySpotPositions();
  }

  private applySpotPositions() {
    this._spots.forEach((spot, idx) => spot.assignPosition(idx));
  }

  private _getSpot(position: number) {
    const spot = this._spots[position];
    if (!spot) throw new Error("Spot does not exist");
    return spot;
  }

  toJSON(): ShelfJson {
    return {
      position: this.position,
      spots: this.spots,
    };
  }

  static create() {
    const position = -1;
    return new Shelf({ position });
  }
}
