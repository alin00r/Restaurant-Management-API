import { Injectable } from '@nestjs/common';
import { entityIdToString } from '../../generic/types/entity-id.type';
import { UserEntity } from '../entities/user.entity';
import { UserOutDto } from '../dto/user-out.dto';

@Injectable()
export class UserMapper {
  entityToDto(entity: UserEntity): UserOutDto {
    return new UserOutDto({
      id: entityIdToString(entity._id),
      created_at: entity.created_at.getTime(),
      updated_at: entity.updated_at.getTime(),
      fullname: entity.fullname,
      favorite_cuisines: entity.favorite_cuisines,
      following: entity.following,
    });
  }
}