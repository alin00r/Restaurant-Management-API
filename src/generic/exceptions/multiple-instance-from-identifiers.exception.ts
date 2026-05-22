export class MultipleInstanceFromIdentifiersException extends Error {
  constructor() {
    super('Multiple instances were found for the provided identifier');
  }
}
