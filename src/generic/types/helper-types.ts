import mongoose from 'mongoose';

export type Nullable<T> = T | null | undefined;

export const EntityType = mongoose.Schema.Types;
