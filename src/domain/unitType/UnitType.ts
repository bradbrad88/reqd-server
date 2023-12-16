import { Json, PartialBy } from "../../types/utils";
import { AggregateRoot } from "../writeModel/AggregateRoot";
import { UnitTypeRepository } from "./UnitTypeRepository";

export type UnitTypeJson = Json<UnitType>;

export class UnitType extends AggregateRoot<UnitTypeRepository> {
  public readonly value: string;
  public readonly plural: string;

  private constructor(unitType: UnitTypeJson, isNew = true) {
    super();
    this._isNew = isNew;
    this.value = unitType.value;
    this.plural = unitType.plural;
  }

  static create(unitType: PartialBy<UnitTypeJson, "plural">) {
    const plural = unitType.plural || unitType.value + "s";
    return new UnitType({ ...unitType, plural });
  }
}
