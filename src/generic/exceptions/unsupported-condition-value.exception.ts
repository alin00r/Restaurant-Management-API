export class UnsupportedConditionValue extends Error {
  constructor(private readonly key: string) {
    super(
      `Invalid condition: Null or undefined are not supported. Found at key = ${key}`
    );
  }
}
