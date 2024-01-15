import { Json, PartialBy } from "../../types/utils";
import { Shelf, ShelfJson } from "./Shelf";
import { StorageLocation } from "./VenueArea";

// A Section refers to a portion of a StorageSpace. It could be a fridge door, a section of a cupboard. Any logical grouping that makes assessing stock easier.
// Generally when counting stock, people will go section by section, top to bottom which is why this class exists

export type SectionJson = PartialBy<Json<Section>, "shelves">;

export class Section {
  private _shelves: Shelf[];
  private _position!: number;

  constructor(section: SectionJson) {
    this.position = section.position;
    this._shelves = (section.shelves || []).map(shelf => new Shelf(shelf));
  }

  get shelves(): ShelfJson[] {
    return this._shelves.map(shelf => shelf.toJSON());
  }

  get position(): number {
    return this._position;
  }
  set position(position: number) {
    this._position = position;
  }

  setShelfCount(count: number) {
    for (let i = 0; i < count; i++) {
      const shelf = this._shelves[i];
      if (!shelf) this._shelves[i] = Shelf.create();
    }
    this._shelves.length = count;
    this.applyPositions();
  }

  removeShelf(position: number) {
    this._shelves.splice(position, 1);
    if (this._shelves.length === 0) this.setShelfCount(1);
  }

  applyPosition(position: number) {
    this._position = position;
  }

  getSpot(location: StorageLocation) {
    const shelf = this._getShelf(location.shelf);
    return shelf.getSpot(location);
  }

  getShelf(location: Omit<StorageLocation, "spot">) {
    return this._getShelf(location.shelf);
  }

  private _getShelf(position: number) {
    const shelf = this._shelves[position];
    if (!shelf) throw new Error("Shelf position does not exist");
    return shelf;
  }

  private applyPositions() {
    this._shelves.forEach((shelf, idx) => shelf.applyPosition(idx));
  }

  toJSON(): SectionJson {
    return {
      position: this.position,
      shelves: this.shelves,
    };
  }

  static create() {
    const position = -1;
    return new Section({ position });
  }
}
