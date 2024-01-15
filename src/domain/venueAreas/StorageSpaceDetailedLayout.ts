import { Json, PartialBy } from "../../types/utils";
import { Section, SectionJson } from "./Section";
import { StorageLocation } from "./VenueArea";

// StorageSpace could be a display fridge, shelving, keg room floor, cabinet etc, whatever that venue recognises as a discrete storage space.
// A space will comprise of a 3D array of sections/shelves/spots.

// Example 1: Display fridge may have multiple doors where it is easier to assess stock one door at a time. Each door would be a Section and have multiple Shelves. On a Shelf you would have a number of product lines (Spots) each with their own Par Level.

// Example 2: A Keg room StorageSpace may only need a single section and shelf, where each Product of keg beer would be a Spot containing their own Par Level.

export type StorageSpaceDetailedLayoutJson = Json<StorageSpaceDetailedLayout>;

export class StorageSpaceDetailedLayout {
  private _storageName!: string;
  private _sections: Section[];

  constructor(storageSpace: StorageSpaceDetailedLayoutJson) {
    this.storageName = storageSpace.storageName;
    this._sections = (storageSpace.sections || []).map(section => new Section(section));
  }

  get storageName(): string {
    return this._storageName;
  }
  set storageName(name: string) {
    this._storageName = name;
  }

  get sections(): SectionJson[] {
    return this._sections.map(section => section.toJSON());
  }

  setSectionCount(count: number) {
    for (let i = 0; i < count; i++) {
      const section = this._sections[i];
      if (!section) {
        this._sections[i] = Section.create();
        this._sections[i].setShelfCount(1);
      }
    }
    this._sections.length = count;
    this.applyPositions();
  }

  removeSection(section: number) {
    this._sections.splice(section, 1);
  }

  getSection(location: Omit<StorageLocation, "spot" | "shelf">) {
    return this._getSection(location.section);
  }

  getShelf(location: Omit<StorageLocation, "spot">) {
    const section = this._getSection(location.section);
    return section.getShelf(location);
  }

  getSpot(location: StorageLocation) {
    const section = this._getSection(location.section);
    return section.getSpot(location);
  }

  private _getSection(position: number) {
    const section = this._sections[position];
    if (!section) throw new Error("Section does not exist");
    return section;
  }

  setShelfCount(doorPosition: number, shelves: number) {
    const section = this._getSection(doorPosition);
    section.setShelfCount(shelves);
    this.applyPositions();
  }

  private applyPositions() {
    this._sections.forEach((section, idx) => section.applyPosition(idx));
  }

  toJSON(): StorageSpaceDetailedLayoutJson {
    return {
      storageName: this.storageName,
      sections: this.sections,
    };
  }

  static create(space: PartialBy<StorageSpaceDetailedLayoutJson, "sections">) {
    return new StorageSpaceDetailedLayout({ ...space, sections: [] });
  }
}
