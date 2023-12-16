import { v4 as uuid } from "uuid";
import ValidationError from "../../errors/ValidationError";
import { AggregateRoot } from "../writeModel/AggregateRoot";
import { VenueAreaRepository } from "./VenueAreaRepository";
import { StorageSpace } from "./StorageSpace";

import type { Json, PartialBy } from "../../types/utils";
import type { StorageSpaceJson } from "./StorageSpace";
import type { SpotJson } from "./Spot";

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
  private _storageSpaces: Array<StorageSpace>;

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

  get storageSpaces(): StorageSpaceJson[] {
    return this._storageSpaces.map(space => space.toJSON());
  }

  createStorageSpace(storageName: string) {
    const existingSpace = this._storageSpaces.find(space => space.storageName === storageName);
    if (existingSpace)
      throw new Error("Storage Space already exists with name: " + storageName);
    const space = StorageSpace.create({ storageName });
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

  private getShelf(location: Omit<StorageLocation, "spot">) {
    const space = this.getStorageSpace(location.storageSpace);
    return space.getShelf(location);
  }

  private getSpot(location: StorageLocation) {
    const space = this.getStorageSpace(location.storageSpace);
    return space.getSpot(location);
  }

  private constructStorageSpaces(spaces: StorageSpaceJson[] = []) {
    return spaces.map(space => new StorageSpace(space));
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
