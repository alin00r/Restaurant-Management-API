import mongoose from 'mongoose';

export type EntityId = mongoose.Types.ObjectId;

export const entityIdToString = (id: EntityId): string => id.toString();
