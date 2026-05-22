import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseEntity } from './../../generic/types/entity-base.entity';
import { EntityOmited } from '../../generic/types/entity-omited-fields.type';
import { MongoGeoPoint } from '../../generic/repository/schemas/geo-point.schema';
import { EntityType } from '../../generic/types/helper-types';
import { EntityId } from '../../generic/types/entity-id.type';
@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

export class RestaurantEntity extends BaseEntity {
  @Prop({ type: EntityType.Mixed, required: true })
  translations: Record<string, string>;
  @Prop({ type: mongoose.Schema.Types.String, required: true, unique: true })
  slug: string;
  @Prop({
    type: [mongoose.Schema.Types.String],
    required: true,
    validate: {
      validator: function (val: string[]) {
        return val.length >= 1 && val.length <= 3;
      },
      message: 'A restaurant must have between 1 and 3 cuisines.'
    }
  })
  cuisines: string[];
   @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  location: MongoGeoPoint;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  followers?: EntityId[];
  constructor(args: EntityOmited<RestaurantEntity>) {
    super();
    this.translations = args.translations;
    this.slug = args.slug;
    this.cuisines = args.cuisines;
    this.location = args.location;
    this.followers = args.followers;
  }
}

export const RestaurantSchema = SchemaFactory.createForClass(RestaurantEntity);


export interface RestaurantUniqueIdentifiers {
  slug: string;
}