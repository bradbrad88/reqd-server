import { SequentialIdGenerator } from "../../utils/SequentialIdGenerator";
import { Section, SectionJson } from "./Section";
import { Shelf, ShelfJson } from "./Shelf";
import { Spot, SpotJson } from "./Spot";
import { convertMapToObject, convertObjectToMap } from "../../utils/map";
import { moveArrayItem } from "../../utils/array";

import type { Json } from "../../types/utils";
import { ProductLine, ProductLineJson } from "./ProductLine";

// StorageSpace could be a display fridge, shelving, keg room floor, cabinet etc, whatever that venue recognises as a discrete storage space.
// A space will comprise of a 3D array of sections/shelves/spots.

// Example 1: Display fridge may have multiple doors where it is easier to assess stock one door at a time. Each door would be a Section and have multiple Shelves. On a Shelf you would have a number of product lines (Spots) each with their own Par Level.

// Example 2: A Keg room StorageSpace may only need a single section and shelf, where each Product of keg beer would be a Spot containing their own Par Level.

export type StorageSpaceDetailedLayoutJson = Json<StorageSpaceDetailedLayout>;
export type EditSpot = Partial<SpotJson>;

type MapKey = string | number | symbol;

type SectionMap = Map<MapKey, Section>;
type SectionMapJson = { [key: string]: SectionJson };
type SectionLayout = string[];

type ShelfMap = Map<MapKey, Shelf>;
type ShelfMapJson = { [key: string]: ShelfJson };

type SpotMap = Map<MapKey, Spot>;
type SpotMapJson = { [key: string]: SpotJson };

export class StorageSpaceDetailedLayout {
  public readonly layoutType = "layout" as const;
  private _storageName!: string;
  private _sections: SectionMap;
  private _shelves: ShelfMap;
  private _spots: SpotMap;

  public sectionLayout: SectionLayout;
  // Need predictable IDs for sections, shelves and spots so that UI can be optimistically updated
  private _idSequence: SequentialIdGenerator;

  constructor(storageSpace: Omit<StorageSpaceDetailedLayoutJson, "layoutType">) {
    const { sectionLayout, sections, shelves, spots, storageName } = storageSpace;
    this.storageName = storageName;
    this._sections = this.constructSections(sections);
    this._shelves = this.constructShelves(shelves);
    this._spots = this.constructSpots(spots);

    this.sectionLayout = sectionLayout;

    this._idSequence = new SequentialIdGenerator(storageSpace.currentIdSequence);
  }

  get currentIdSequence() {
    return this._idSequence.currentSequence;
  }

  private constructSections(sections: SectionMapJson) {
    return convertObjectToMap(sections, section => Section.reconstitute(section));
  }
  private constructShelves(shelves: ShelfMapJson) {
    return convertObjectToMap(shelves, shelf => Shelf.reconstitute(shelf));
  }
  private constructSpots(spots: SpotMapJson) {
    return convertObjectToMap(spots, spot => Spot.reconstitute(spot));
  }

  get storageName(): string {
    return this._storageName;
  }
  set storageName(name: string) {
    this._storageName = name;
  }

  get sections(): SectionMapJson {
    return convertMapToObject(this._sections);
  }

  get shelves(): ShelfMapJson {
    return convertMapToObject(this._shelves);
  }

  get spots(): SpotMapJson {
    return convertMapToObject(this._spots);
  }

  getProductLines(): string[] {
    const arr: string[] = [];
    for (const spot of this._spots.values()) {
      if (spot.productLine) arr.push(spot.productLine);
    }
    return arr;
  }

  private _addSection() {
    const id = this._idSequence.consumeId("section");
    const section = Section.create(id);
    this._sections.set(section.id, section);
    this.sectionLayout.push(section.id);
  }

  private _addShelf(sectionId: string) {
    const section = this._getSection(sectionId);
    const id = this._idSequence.consumeId("shelf");
    const shelf = Shelf.create(id, sectionId);
    this._shelves.set(id, shelf);
    section.addShelf(id);
  }

  private _addSpot(shelfId: string) {
    const shelf = this._getShelf(shelfId);
    const id = this._idSequence.consumeId("spot");
    const spot = Spot.create(id, shelfId);
    this._spots.set(id, spot);
    shelf.addSpot(id);
  }

  // Non destructive
  setSectionCount(count: number) {
    const newSectionCount = count - this.sectionLayout.length;
    if (newSectionCount < 0)
      throw new Error(
        "Set Section Count is a non-destructive function. Can't set section count less than current count"
      );
    for (let i = 0; i < newSectionCount; i++) {
      this._addSection();
    }
  }

  // Non destructive
  setShelfCount(sectionId: string, count: number) {
    const section = this._getSection(sectionId);
    const newShelfCount = count - section.shelfLayout.length;
    if (newShelfCount < 0)
      throw new Error(
        "Set Shelf Count is a non-destructive function. Can't set shelf count less than current count"
      );
    for (let i = 0; i < newShelfCount; i++) {
      this._addShelf(sectionId);
    }
  }

  // Non destructive
  setSpotCount(shelfId: string, count: number) {
    const shelf = this._getShelf(shelfId);
    const newSpotCount = count - shelf.spotLayout.length;
    if (newSpotCount < 0)
      throw new Error(
        "Set Spot Count is a non-destructive function. Can't set spot count less than current count"
      );
    for (let i = 0; i < newSpotCount; i++) {
      this._addSpot(shelfId);
    }
  }

  removeSection(sectionId: string) {
    const section = this._getSection(sectionId);
    [...section.shelfLayout].forEach(shelf => {
      this.removeShelf(shelf);
    });
    this._sections.delete(sectionId);
    this.sectionLayout = this.sectionLayout.filter(id => id !== sectionId);
  }

  removeShelf(shelfId: string) {
    const shelf = this._getShelf(shelfId);
    const section = this._getSection(shelf.sectionId);
    [...shelf.spotLayout].forEach(spot => {
      this.removeSpot(spot);
    });
    this._shelves.delete(shelfId);
    section.removeShelf(shelfId);
  }

  removeSpot(spotId: string) {
    const spot = this._getSpot(spotId);
    const shelf = this._getShelf(spot.shelfId);
    shelf.removeSpot(spotId);
    this._spots.delete(spotId);
    return spot.removeProductLine();
  }

  moveSection(sectionId: string, newIndex: number) {
    if (newIndex < 0 || newIndex >= this.sectionLayout.length)
      throw new Error("Invalid index to move section to");
    const oldIndex = this.sectionLayout.findIndex(id => id === sectionId);
    if (oldIndex == null) throw new Error("Couldn't find section of id: " + sectionId);
    this.sectionLayout = moveArrayItem(this.sectionLayout, oldIndex, newIndex);
  }

  moveShelf(sectionId: string, shelfId: string, newIndex: number) {
    const shelf = this._getShelf(shelfId);
    const section = this._getSection(shelf.sectionId);
    if (newIndex < 0) throw new Error("Invalid index to move shelf to");
    if (shelf.sectionId === sectionId) {
      section.moveShelf(shelfId, newIndex);
    } else {
      const newSection = this._getSection(sectionId);
      section.removeShelf(shelfId);
      newSection.insertShelf(shelfId, newIndex);
      shelf.sectionId = sectionId;
    }
  }

  moveSpot(spotId: string, shelfId: string, newIndex: number) {
    const spot = this._getSpot(spotId);
    const shelf = this._getShelf(spot.shelfId);
    if (newIndex < 0) throw new Error("Invalid index to move shelf to");
    if (spot.shelfId === shelfId) {
      shelf.moveSpot(spotId, newIndex);
    } else {
      const newShelf = this._getShelf(shelfId);
      shelf.removeSpot(spotId);
      newShelf.insertSpot(spotId, newIndex);
      spot.shelfId = shelfId;
    }
  }

  editSpot(spotId: string, vars: EditSpot) {
    const spot = this._getSpot(spotId);
    if (vars.stackHeight) spot.stackHeight = vars.stackHeight;
    if (vars.columnWidth) spot.columnWidth = vars.columnWidth;
  }

  setProductLine(spotId: string, productLine: string) {
    const spot = this._getSpot(spotId);
    spot.setProductLine(productLine);
  }
  removeProductLine(spotId: string) {
    const spot = this._getSpot(spotId);
    return spot.removeProductLine();
  }

  private _getSection(sectionId: string) {
    const section = this._sections.get(sectionId);
    if (!section) throw new Error("Couldn't find section of id: " + sectionId);
    return section;
  }

  private _getShelf(shelfId: string) {
    const shelf = this._shelves.get(shelfId);
    if (!shelf) throw new Error("Couldn't find shelf of id: " + shelfId);
    return shelf;
  }

  private _getSpot(spotId: string) {
    const spot = this._spots.get(spotId);
    if (!spot) throw new Error("Coudln't find spot of id: " + spotId);
    return spot;
  }

  static create(storageName: string) {
    return new StorageSpaceDetailedLayout({
      storageName,
      sections: {},
      shelves: {},
      spots: {},
      sectionLayout: [],
      currentIdSequence: 0,
    });
  }

  toJSON(): StorageSpaceDetailedLayoutJson {
    return {
      storageName: this.storageName,
      layoutType: this.layoutType,
      sections: this.sections,
      shelves: this.shelves,
      spots: this.spots,
      sectionLayout: this.sectionLayout,
      currentIdSequence: this.currentIdSequence,
    };
  }
}
