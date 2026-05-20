import mongoose from 'mongoose';

export type AnyFn = (...args: any[]) => any;
export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends AnyFn ? never : K;
}[keyof T];
export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

export type Nullable<T> = T | null | undefined;

export const EntityType = mongoose.Schema.Types;

export type ListItemGroup<T> = {
  items: T[];
  key: string
}