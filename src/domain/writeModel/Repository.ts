import { OperationResponse } from "../../types/OperationResponse";
import { AggregateRoot } from "./AggregateRoot";

export abstract class Repository {
  abstract save(aggregate: AggregateRoot<any>): Promise<OperationResponse>;
}
