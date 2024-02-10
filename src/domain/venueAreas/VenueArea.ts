import { v4 as uuid } from "uuid";
import ValidationError from "../../errors/ValidationError";
import { AggregateRoot } from "../writeModel/AggregateRoot";
import { VenueAreaRepository } from "./VenueAreaRepository";
import { StorageSpaceDetailedLayout } from "./StorageSpaceDetailedLayout";
import { ProductLine, ProductLineJson } from "./ProductLine";

import type { Json, PartialBy } from "../../types/utils";
import type { EditSpot, StorageSpaceDetailedLayoutJson } from "./StorageSpaceDetailedLayout";
import { SequentialIdGenerator } from "../../utils/SequentialIdGenerator";

export type VenueAreaJson = Json<VenueArea>;

type StorageSpaceMapJson = { [key: string]: StorageSpaceJson };

type StorageSpaceMap = Map<string, StorageSpace>;

type ProductLineMap = Map<string, ProductLine>;

type ProductLineMapJson = { [key: string]: ProductLineJson };

export type ProductLineLocation = ProductLineListLocation | ProductLineLayoutLocation;

type ProductLineListLocation = {
  storageSpace: string;
  index: number;
};

type ProductLineLayoutLocation = {
  storageSpace: string;
  spotId: string;
};

type StorageSpaceJson = StorageSpaceDetailedLayoutJson;

type StorageSpace = StorageSpaceDetailedLayout;

type StorageSpaceLayout = string[];

export default class VenueArea extends AggregateRoot<VenueAreaRepository> {
  public readonly id: string;
  public readonly venueId: string;
  public storageSpaceLayout: StorageSpaceLayout;
  private _areaName!: string;
  private _storageSpaces: StorageSpaceMap;
  private _productLines: ProductLineMap;
  private _idSequence: SequentialIdGenerator;

  public get areaName(): string {
    return this._areaName;
  }
  public set areaName(name: string) {
    const validatedName = this.validateName(name);
    this._areaName = validatedName;
  }

  get storageSpaces(): StorageSpaceMapJson {
    const spaces: StorageSpaceMapJson = {};
    for (const [id, space] of this._storageSpaces.entries()) {
      spaces[id] = space.toJSON();
    }
    return spaces;
  }

  get productLines(): ProductLineMapJson {
    const productLines: ProductLineMapJson = {};
    for (const [id, productLine] of this._productLines.entries()) {
      productLines[id] = productLine;
    }
    return productLines;
  }

  get currentIdSequence() {
    return this._idSequence.currentSequence;
  }

  private constructor(
    venueArea: VenueAreaJson,
    repository: VenueAreaRepository,
    isNew = true
  ) {
    super(repository);
    this._isNew = isNew;
    this.id = venueArea.id;
    this.venueId = venueArea.venueId;
    this.areaName = venueArea.areaName;
    this.storageSpaceLayout = venueArea.storageSpaceLayout;
    this._storageSpaces = this.constructStorageSpaces(venueArea.storageSpaces);
    this._productLines = this.constructProductLines(venueArea.productLines);
    this._idSequence = new SequentialIdGenerator(venueArea.currentIdSequence);
  }

  private constructStorageSpaces(spaces: StorageSpaceMapJson) {
    const map = new Map<string, StorageSpace>();
    for (const space in spaces) {
      map.set(space, new StorageSpaceDetailedLayout(spaces[space]));
    }
    return map;
  }
  private constructProductLines(productLines: ProductLineMapJson) {
    const map = new Map<string, ProductLine>();
    for (const productLine in productLines) {
      map.set(productLine, ProductLine.create(productLines[productLine]));
    }
    return map;
  }

  createStorageSpace(storageName: string, layoutType: "layout" | "list") {
    if (this._storageSpaces.has(storageName))
      throw new Error("Storage Space already exists with name: " + storageName);
    let space: StorageSpace;
    switch (layoutType) {
      case "layout":
        space = StorageSpaceDetailedLayout.create(storageName);
        break;
      default:
        throw new Error(
          `Creation of storage space type: '${layoutType}' has not been implemented`
        );
    }
    this._storageSpaces.set(space.storageName, space);
    this.storageSpaceLayout.push(space.storageName);
  }

  removeStorageSpace(storageName: string) {
    const space = this._storageSpaces.get(storageName);
    if (!space) throw new Error(`Couldn't find a storage space with name: '${storageName}'`);
    this.storageSpaceLayout = this.storageSpaceLayout.filter(id => id !== storageName);
    space.getProductLines().forEach(pl => {
      this._productLines.delete(pl);
    });
    this._storageSpaces.delete(storageName);
  }

  renameStorageSpace(storageName: string, newName: string) {
    const space = this._storageSpaces.get(storageName);
    if (!space) throw new Error(`Couldn't find a storage space with name: '${storageName}'`);
    space.storageName = newName;
    this._storageSpaces.set(space.storageName, space);
    this._storageSpaces.delete(storageName);
    const spaceIndex = this.storageSpaceLayout.indexOf(storageName);
    if (spaceIndex === -1)
      throw new Error(`Storage space does not exist in storageSpaceLayout: '${storageName}'
    `);
    this.storageSpaceLayout.splice(spaceIndex, 1, space.storageName);
  }

  moveStorageSpace(storageName: string, newIndex: number) {
    const index = this.storageSpaceLayout.indexOf(storageName);
    if (index === -1)
      throw new Error(`Couldn't find a storage space with name: '${storageName}'`);
    this.storageSpaceLayout.splice(index, 1);
    this.storageSpaceLayout.splice(newIndex, 0, storageName);
  }

  // Detailed Storage Space Layout
  setSectionCount(storageName: string, sectionCount: number) {
    const space = this._storageSpaces.get(storageName);
    if (!space) throw new Error("Couldn't find space with name: " + storageName);
    space.setSectionCount(sectionCount);
    return space.sectionLayout;
  }

  setShelfCount(storageName: string, sectionId: string, count: number) {
    const space = this._getDetailedLayoutSpace(storageName);
    space.setShelfCount(sectionId, count);
    return space.sections[sectionId].shelfLayout;
  }

  setSpotCount(storageName: string, shelfId: string, count: number) {
    const space = this._getDetailedLayoutSpace(storageName);
    space.setSpotCount(shelfId, count);
    return space.shelves[shelfId].spotLayout;
  }

  removeSection(storageName: string, sectionId: string) {
    const space = this._getDetailedLayoutSpace(storageName);
    space.removeSection(sectionId);
  }

  removeShelf(storageName: string, shelfId: string) {
    const space = this._getDetailedLayoutSpace(storageName);
    space.removeShelf(shelfId);
  }

  removeSpot(storageName: string, spotId: string) {
    const space = this._getDetailedLayoutSpace(storageName);
    const productLineId = space.removeSpot(spotId);
    if (productLineId) this._productLines.delete(productLineId);
  }

  moveSection(storageName: string, sectionId: string, newIndex: number) {
    const space = this._getDetailedLayoutSpace(storageName);
    space.moveSection(sectionId, newIndex);
  }

  moveShelf(storageName: string, sectionId: string, shelfId: string, newIndex: number) {
    const space = this._getDetailedLayoutSpace(storageName);
    space.moveShelf(sectionId, shelfId, newIndex);
  }

  moveSpot(storageName: string, spotId: string, shelfId: string, newIndex: number) {
    const space = this._getDetailedLayoutSpace(storageName);
    space.moveSpot(spotId, shelfId, newIndex);
  }

  editSpot(storageName: string, spotId: string, vars: EditSpot) {
    const space = this._getDetailedLayoutSpace(storageName);
    space.editSpot(spotId, vars);
  }

  setProductLine(location: ProductLineLocation, productLine: Partial<ProductLineJson>) {
    const space = this._storageSpaces.get(location.storageSpace);
    if (!space) throw new Error(`Couldn't find space with name: '${location.storageSpace}'`);
    if (space.layoutType === "layout") {
      if ("index" in location) throw new Error("Wrong location type for this Storage Space");
      const id = this._idSequence.consumeId("product-line");
      const productId = productLine.productId || null;
      const parLevel = productLine.parLevel || null;
      const newProductLine = ProductLine.create({ id, productId, parLevel });
      space.setProductLine(location.spotId, newProductLine.id);
      this._productLines.set(newProductLine.id, newProductLine);
    }
  }

  removeProductLine(location: ProductLineLocation) {
    const space = this._storageSpaces.get(location.storageSpace);
    if (!space) throw new Error(`Couldn't find space with name: '${location.storageSpace}'`);
    if (space.layoutType === "layout") {
      if ("index" in location) throw new Error("Wrong location type for this Storage Space");
      const id = space.removeProductLine(location.spotId);
      if (id) this._productLines.delete(id);
    }
  }

  editProductLine(productLineId: string, productLineOptions: Partial<ProductLineJson>) {
    const { parLevel, productId } = productLineOptions;
    const productLine = this._productLines.get(productLineId);
    if (!productLine) throw new Error("Couldn't find product line of id: " + productLineId);
    if (parLevel !== undefined) productLine.parLevel = parLevel;
    if (productId !== undefined) productLine.productId = productId;
  }

  private _getDetailedLayoutSpace(storageName: string) {
    const space = this._storageSpaces.get(storageName);
    if (!space) throw new Error("Couldn't find space with name: " + storageName);
    if (!(space instanceof StorageSpaceDetailedLayout))
      throw new Error("Can't remove section from this type of storage space");
    return space;
  }

  static create(
    venueArea: PartialBy<
      VenueAreaJson,
      "id" | "storageSpaces" | "productLines" | "storageSpaceLayout" | "currentIdSequence"
    >,
    repository: VenueAreaRepository
  ) {
    const id = uuid();
    return new VenueArea(
      {
        ...venueArea,
        id,
        storageSpaces: {},
        storageSpaceLayout: [],
        productLines: {},
        currentIdSequence: 0,
      },
      repository
    );
  }
  static async reconstituteById(id: string, repository: VenueAreaRepository) {
    return await repository.findById(id);
  }
  static reconstitute(venueArea: VenueAreaJson, repository: VenueAreaRepository) {
    return new VenueArea(venueArea, repository, false);
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
      productLines: this.productLines,
      storageSpaceLayout: this.storageSpaceLayout,
      currentIdSequence: this.currentIdSequence,
    };
  }
}
