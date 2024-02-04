import { Repository } from "./Repository";

export class AggregateRoot<IRepository extends Repository> {
  protected _isNew = true;
  #repository: IRepository;

  constructor(repository: IRepository) {
    this.#repository = repository;
  }

  public isNew(): boolean {
    return this._isNew;
  }

  async save() {
    return await this.#repository.save(this);
  }

  async delete() {
    return await this.#repository.delete(this);
  }
}
