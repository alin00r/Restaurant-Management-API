import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class MongoGeoPoint {
  @Prop({ type: mongoose.Schema.Types.String, enum: ['Point'], required: true })
  type: 'Point';
  @Prop({ type: [mongoose.Schema.Types.Number], required: true })
  coordinates: number[];

  constructor(args: { longitude: number; latitude: number }) {
    this.type = 'Point';
    this.coordinates = [args.longitude, args.latitude];
  }
}

export function getLongitude(point: MongoGeoPoint): number {
  return point.coordinates[0];
}

export function getLatitude(point: MongoGeoPoint): number {
  return point.coordinates[1];
}
