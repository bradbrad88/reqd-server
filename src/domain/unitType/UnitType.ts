import { Json, PartialBy } from "../../types/utils";
import { AggregateRoot } from "../writeModel/AggregateRoot";
import { UnitTypeRepository } from "./UnitTypeRepository";

export type UnitTypeJson = Json<UnitType>;

export class UnitType extends AggregateRoot<UnitTypeRepository> {
  public readonly value: string;
  public readonly plural: string;

  private constructor(unitType: UnitTypeJson, repository: UnitTypeRepository, isNew = true) {
    super(repository);
    this._isNew = isNew;
    this.value = unitType.value;
    this.plural = unitType.plural;
  }

  static create(unitType: PartialBy<UnitTypeJson, "plural">, repository: UnitTypeRepository) {
    const plural = unitType.plural || unitType.value + "s";
    return new UnitType({ ...unitType, plural }, repository);
  }
}
