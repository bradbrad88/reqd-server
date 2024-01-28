export class SequentialIdGenerator {
  private _currentSequence: number;

  constructor(current: number | null | undefined) {
    if (current == null) {
      this._currentSequence = 0;
    } else {
      this._currentSequence = current;
    }
  }

  consumeId(prefix?: string) {
    const id = `${prefix ? prefix + "-" : ""}${this._currentSequence}`;
    this._currentSequence++;
    return id;
  }

  get currentSequence(): number {
    return this._currentSequence;
  }
}
