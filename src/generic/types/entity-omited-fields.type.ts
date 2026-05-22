export type EntityOmitedFields = '_id' | 'updated_at' | 'created_at';

export type EntityOmited<T> = Omit<T, EntityOmitedFields>;
