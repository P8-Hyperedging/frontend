export type Optional<T> = [T | null, boolean];

export function getValue<T>(op: Optional<T>): T {
  if (hasValue(op)) {
    return op[0] as T;
  }
  throw Error("Optional has no value");
}

export function hasValue<T>(op: Optional<T>) {
  return op[1];
}
