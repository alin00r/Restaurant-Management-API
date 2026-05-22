import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import  mongoose from 'mongoose';
import { BaseEntity } from './../../generic/types/entity-base.entity';
import { EntityOmited } from '../../generic/types/entity-omited-fields.type';
import { EntityId } from '../../generic/types/entity-id.type';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

export class UserEntity extends BaseEntity {
  @Prop({ required: true })
  fullname: string;
  @Prop({ type: [String], required: true, })
  favorite_cuisines: string[];
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }] })
  following: EntityId[];
  constructor(args: EntityOmited<UserEntity>) {
    super();
    this.fullname = args.fullname;
    this.favorite_cuisines = args.favorite_cuisines;
    this.following = args.following;
  }
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
