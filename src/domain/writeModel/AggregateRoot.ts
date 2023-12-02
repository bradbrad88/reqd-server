import { Repository } from "./Repository";

export class AggregateRoot<IRepository extends Repository> {
  protected _isNew = true;

  public isNew(): boolean {
    return this._isNew;
  }

  async save(repository: IRepository) {
    await repository.save(this);
  }
}
