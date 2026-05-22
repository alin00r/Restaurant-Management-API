export function normalizeValue<T>(value: T): T {
  if (typeof value === 'string') {
    return value.toLowerCase().trim() as unknown as T;
  }
  return value;
}
