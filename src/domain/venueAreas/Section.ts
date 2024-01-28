import { Json } from "../../types/utils";
import { moveArrayItem } from "../../utils/array";

// A Section refers to a portion of a StorageSpace. It could be a fridge door, a section of a cupboard. Any logical grouping that makes assessing stock easier.
// Generally when counting stock, people will go section by section, top to bottom which is why this class exists

export type SectionJson = Json<Section>;

type ShelfLayout = string[];

export class Section {
  public readonly id: string;
  public shelfLayout: ShelfLayout;

  private constructor(section: SectionJson) {
    const { id, shelfLayout } = section;
    this.id = id;
    this.shelfLayout = shelfLayout;
  }

  addShelf(shelfId: string) {
    this.shelfLayout.push(shelfId);
  }

  insertShelf(shelfId: string, index: number) {
    this.shelfLayout.splice(index, 0, shelfId);
  }

  moveShelf(shelfId: string, newIndex: number) {
    const oldIndex = this.shelfLayout.findIndex(id => id === shelfId);
    if (oldIndex == null) throw new Error("Couldn't find shelf of id: " + shelfId);
    this.shelfLayout = moveArrayItem(this.shelfLayout, oldIndex, newIndex);
  }

  removeShelf(shelfId: string) {
    this.shelfLayout = this.shelfLayout.filter(id => id !== shelfId);
  }

  toJSON(): SectionJson {
    return {
      id: this.id,
      shelfLayout: this.shelfLayout,
    };
  }

  static reconstitute(section: SectionJson) {
    return new Section(section);
  }

  static create(id: string) {
    return new Section({ id, shelfLayout: [] });
  }
}
