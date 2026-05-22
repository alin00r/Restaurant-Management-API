import { EntityId } from './entity-id.type';

export class BaseEntityTiny {
  _id!: EntityId;
}

export class BaseEntity extends BaseEntityTiny {
  created_at!: Date;
  updated_at!: Date;
}
