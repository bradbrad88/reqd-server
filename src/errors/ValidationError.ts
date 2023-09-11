export default class ValidationError extends Error {
  constructor(msg: string) {
    super("Validation Error" + msg);
  }
  static MinimumLength(str: string, minLength: number) {
    return new ValidationError(
      `The name provided: '${str}' is too short. It must be at least ${minLength} characters`
    );
  }
}
