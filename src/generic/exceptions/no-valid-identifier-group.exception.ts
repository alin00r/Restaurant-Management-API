export class NoValidIdentifierGroupException<T> extends Error {
  constructor(public readonly groups: (keyof T)[][]) {
    const groupAsString = groups.map((g) => `[${g.join(',')}]`).join(';');
    super(`Invalid identifier groups: ${groupAsString}`);
  }
}
