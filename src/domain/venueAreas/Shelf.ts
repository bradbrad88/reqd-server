import { Json } from "../../types/utils";
import { moveArrayItem } from "../../utils/array";

export type ShelfJson = Json<Shelf>;

type SpotLayout = string[];
export class Shelf {
  public readonly id: string;
  public sectionId: string;
  public spotLayout: SpotLayout;

  constructor(shelf: ShelfJson) {
    const { id, sectionId, spotLayout } = shelf;
    this.id = id;
    this.sectionId = sectionId;
    this.spotLayout = spotLayout;
  }

  addSpot(spotId: string) {
    this.spotLayout.push(spotId);
  }

  insertSpot(spotId: string, index: number) {
    this.spotLayout.splice(index, 0, spotId);
  }

  moveSpot(spotId: string, newIndex: number) {
    const oldIndex = this.spotLayout.findIndex(id => id === spotId);
    if (oldIndex == null) throw new Error("Couldn't find spot of id: " + spotId);
    this.spotLayout = moveArrayItem(this.spotLayout, oldIndex, newIndex);
  }

  removeSpot(spotId: string) {
    this.spotLayout = this.spotLayout.filter(id => id !== spotId);
  }

  toJSON(): ShelfJson {
    return {
      id: this.id,
      sectionId: this.sectionId,
      spotLayout: this.spotLayout,
    };
  }

  static reconstitute(shelf: ShelfJson) {
    return new Shelf(shelf);
  }

  static create(id: string, sectionId: string) {
    return new Shelf({ id, sectionId, spotLayout: [] });
  }
}
