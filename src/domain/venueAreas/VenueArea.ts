import { v4 as uuid } from "uuid";
import ValidationError from "../../errors/ValidationError";
import { AggregateRoot } from "../writeModel/AggregateRoot";
import { VenueAreaRepository } from "./VenueAreaRepository";
import { StorageSpaceDetailedLayout } from "./StorageSpaceDetailedLayout";

import type { Json, PartialBy } from "../../types/utils";
import type { StorageSpaceDetailedLayoutJson } from "./StorageSpaceDetailedLayout";
import type { SpotJson } from "./Spot";
import { Section } from "./Section";

export type VenueAreaJson = PartialBy<Json<VenueArea>, "storageSpaces">;

export type StorageLocation = {
  storageSpace: string;
  section: number;
  shelf: number;
  spot: number;
};

export default class VenueArea extends AggregateRoot<VenueAreaRepository> {
  public readonly id: string;
  public readonly venueId: string;
  private _areaName!: string;
  // The order of the storage spaces matters, so keep as an array instead of map
  private _storageSpaces: Array<StorageSpaceDetailedLayout>;

  private constructor(venueArea: VenueAreaJson, isNew = true) {
    super();
    this._isNew = isNew;
    this.id = venueArea.id;
    this.venueId = venueArea.venueId;
    this.areaName = venueArea.areaName;
    this._storageSpaces = this.constructStorageSpaces(venueArea.storageSpaces);
  }

  public get areaName(): string {
    return this._areaName;
  }
  public set areaName(name: string) {
    const validatedName = this.validateName(name);
    this._areaName = validatedName;
  }

  get storageSpaces(): StorageSpaceDetailedLayoutJson[] {
    return this._storageSpaces.map(space => space.toJSON());
  }

  createStorageSpace(storageName: string) {
    const existingSpace = this._storageSpaces.find(space => space.storageName === storageName);
    if (existingSpace)
      throw new Error("Storage Space already exists with name: " + storageName);
    const space = StorageSpaceDetailedLayout.create({ storageName });
    this._storageSpaces.push(space);
  }

  setSectionCount(storageName: string, sectionCount: number) {
    const space = this.getStorageSpace(storageName);
    space.setSectionCount(sectionCount);
  }

  setShelfCount(storageName: string, section: number, shelves: number) {
    const space = this._storageSpaces.find(space => space.storageName === storageName);
    if (!space) throw new Error("Storage space not found");
    space.setShelfCount(section, shelves);
  }

  addSpot(
    location: { storageSpace: string; section: number; shelf: number },
    spot: Partial<SpotJson>
  ) {
    const shelf = this.getShelf(location);
    shelf.addSpot(spot);
  }

  changeSpotProduct(location: StorageLocation, productId: string | null) {
    const spot = this.getSpot(location);
    spot.productId = productId;
  }

  changeSpotParLevel(location: StorageLocation, parLevel: number) {
    const spot = this.getSpot(location);
    spot.parLevel = parLevel;
  }

  changeSpotColumnSpan(location: StorageLocation, columnSpan: number) {
    const spot = this.getSpot(location);
    spot.columnSpan = columnSpan;
  }

  removeSpot(location: StorageLocation) {
    const shelf = this.getShelf(location);
    shelf.removeSpot(location.spot);
  }

  removeShelf(location: Omit<StorageLocation, "spot">) {
    const section = this.getSection(location);
    section.removeShelf(location.shelf);
  }

  removeSection(location: Omit<StorageLocation, "spot" | "shelf">) {
    const space = this.getStorageSpace(location.storageSpace);
    space.removeSection(location.section);
  }

  removeStorageSpace(location: Omit<StorageLocation, "spot" | "shelf" | "section">) {
    this._storageSpaces.filter(space => space.storageName !== location.storageSpace);
  }

  private getSection(location: Omit<StorageLocation, "spot" | "shelf">): Section {
    const space = this.getStorageSpace(location.storageSpace);
    return space.getSection(location);
  }

  private getShelf(location: Omit<StorageLocation, "spot">) {
    const space = this.getStorageSpace(location.storageSpace);
    return space.getShelf(location);
  }

  private getSpot(location: StorageLocation) {
    const space = this.getStorageSpace(location.storageSpace);
    return space.getSpot(location);
  }

  private constructStorageSpaces(spaces: StorageSpaceDetailedLayoutJson[] = []) {
    return spaces.map(space => new StorageSpaceDetailedLayout(space));
  }

  private getStorageSpace(storageName: string) {
    const space = this._storageSpaces.find(space => space.storageName === storageName);
    if (!space) throw new Error("Storage space not found with name: " + storageName);
    return space;
  }

  static create(venueArea: PartialBy<VenueAreaJson, "id">) {
    const id = uuid();
    return new VenueArea({ ...venueArea, id });
  }

  static async reconstituteById(id: string, repository: VenueAreaRepository) {
    return await repository.findById(id);
  }

  static reconstitute(venueArea: VenueAreaJson) {
    return new VenueArea(venueArea, false);
  }

  private validateName(newName: string) {
    let validatedName = newName.trim();
    const minLength = 2;
    if (validatedName.length < minLength) {
      throw ValidationError.MinimumLength(validatedName, minLength);
    }
    return validatedName;
  }

  toJSON(): VenueAreaJson {
    return {
      id: this.id,
      venueId: this.venueId,
      areaName: this.areaName,
      storageSpaces: this.storageSpaces,
    };
  }
}
