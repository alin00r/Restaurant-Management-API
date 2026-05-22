import { Injectable } from '@nestjs/common';
import { entityIdToString } from '../../generic/types/entity-id.type';
import { RestaurantOutDto } from '../dto/restaurants-out.dto';
import { RestaurantEntity } from '../entities/restaurant.entity';
import { getLongitude, getLatitude } from '../../generic/repository/schemas/geo-point.schema';

@Injectable()
export class RestaurantMapper {
  entityToDto(entity: RestaurantEntity): RestaurantOutDto {
    return new RestaurantOutDto({
      id: entityIdToString(entity._id),
      created_at: entity.created_at.getTime(),
      updated_at: entity.updated_at.getTime(),
      translations: entity.translations,
      slug: entity.slug,
      cuisines: entity.cuisines,
      longitude: getLongitude(entity.location),
      latitude: getLatitude(entity.location),
    });
  }
}