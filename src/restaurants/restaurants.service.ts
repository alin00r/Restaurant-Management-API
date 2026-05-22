import { Injectable, NotFoundException } from "@nestjs/common";
import { RestaurantRepository } from './repository/restaurant.repository';
import { RestaurantEntity } from './entities/restaurant.entity';
import { MongoGeoPoint } from '.././generic/repository/schemas/geo-point.schema';
import { CreateRestaurantDto } from './dto/create-restaurants.dto';
import { ERROR_CODES } from 'src/generic/constants/error.codes';

@Injectable()
export class RestaurantService {
  constructor(
    private readonly restaurantRepo: RestaurantRepository,
  ) {}

  async create(dto: CreateRestaurantDto): Promise<RestaurantEntity> {
    const restaurant = new RestaurantEntity({
      translations: dto.translations,
      slug: dto.slug,
      cuisines: dto.cuisines,
      location: new MongoGeoPoint({ longitude: dto.longitude, latitude: dto.latitude })
    });
    if(await this.restaurantRepo.findOneByIdentifier(dto.slug)) {
      throw new NotFoundException(ERROR_CODES.RESTAURANT_ALREADY_EXISTS);
    }
    return this.restaurantRepo.create(restaurant);
  }

  async getAllRestaurants(pagination: any, cuisine?: string): Promise<RestaurantEntity[]> {
    return this.restaurantRepo.findAllWithFilters(pagination, cuisine);
  }

  async findByIdOrSlug(identifier: string): Promise<RestaurantEntity> {
    const restaurant = await this.restaurantRepo.findOneByIdentifier(identifier);
    if (!restaurant) {
      throw new NotFoundException(ERROR_CODES.RESTAURANT_NOT_FOUND);
    }
    return restaurant;
  }

  async findNearby(
    longitude: number,
    latitude: number,
    pagination: { offset?: number; limit?: number } | any
  ): Promise<RestaurantEntity[]> {
    return this.restaurantRepo.findNearby(longitude, latitude, pagination);
  }
}