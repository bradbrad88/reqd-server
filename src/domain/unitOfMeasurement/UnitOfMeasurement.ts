import { Json } from "../../types/utils";
import { AggregateRoot } from "../writeModel/AggregateRoot";
import { UnitOfMeasurementRepository } from "./UnitOfMeasurementRepository";

export type UnitOfMeasurementJson = Json<UnitOfMeasurement>;

export class UnitOfMeasurement extends AggregateRoot<UnitOfMeasurementRepository> {
  public readonly value: string;

  constructor(
    unitOfMeasurement: UnitOfMeasurementJson,
    repository: UnitOfMeasurementRepository,
    isNew = true
  ) {
    super(repository);
    this._isNew = isNew;
    this.value = unitOfMeasurement.value;
  }

  static create(
    unitOfMeasurement: UnitOfMeasurementJson,
    repository: UnitOfMeasurementRepository
  ) {
    return new UnitOfMeasurement(unitOfMeasurement, repository);
  }
}
