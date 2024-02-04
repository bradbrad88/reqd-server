import { Json, PartialBy } from "../../types/utils";
import { AggregateRoot } from "../writeModel/AggregateRoot";
import { PackageTypeRepository } from "./PackageTypeRepository";

export type PackageTypeJson = Json<PackageType>;

export class PackageType extends AggregateRoot<PackageTypeRepository> {
  public readonly value: string;
  public readonly plural: string;

  private constructor(
    packageType: PackageTypeJson,
    repository: PackageTypeRepository,
    isNew = true
  ) {
    super(repository);
    this._isNew = isNew;
    this.value = packageType.value;
    this.plural = packageType.plural;
  }

  static create(
    packageType: PartialBy<PackageTypeJson, "plural">,
    repository: PackageTypeRepository
  ) {
    const plural = packageType.plural || packageType.value + "s";
    return new PackageType({ ...packageType, plural }, repository);
  }
}
