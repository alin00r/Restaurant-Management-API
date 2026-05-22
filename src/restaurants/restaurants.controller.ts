import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { RestaurantService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurants.dto';
import { AppControllerHelper } from 'src/generic/helpers/app.controller.helper';
import { RestaurantOutDto } from './dto/restaurants-out.dto';
import { RestaurantMapper } from './mapper/restruatnts.mapper';
import { SearchableTinyPaginationDto} from 'src/generic/types/pagination.tiny.dto';
import { NearbyRestaurantsDto } from './dto/nearby-restaurants.dto';

@Controller('restaurants')
export class RestaurantController {
  constructor(
    private readonly controllerHelper: AppControllerHelper,
    private readonly restaurantMapper: RestaurantMapper,
    private readonly restaurantService: RestaurantService
  ) {}

  @Post()
  async createRestaurant(@Body() createDto: CreateRestaurantDto): Promise<RestaurantOutDto>  {
      this.controllerHelper.requireValidTranslations(createDto.translations);
      const entity=
    await this.restaurantService.create(createDto);
    return this.restaurantMapper.entityToDto(entity);
  }

  @Get()
  async getAllRestaurants(@Query() _pagination: SearchableTinyPaginationDto):Promise<RestaurantOutDto[]> {
  const cuisine = _pagination.cuisine;
  const entities = await this.restaurantService.getAllRestaurants(_pagination, cuisine);
  return entities.map(entity => this.restaurantMapper.entityToDto(entity));
  }

  @Get('nearby')
  async findNearbyRestaurants(@Query() q: NearbyRestaurantsDto): Promise<RestaurantOutDto[]> {
    const pagination = { offset: q.offset ?? 0, limit: q.limit ?? 10 };
    const entities = await this.restaurantService.findNearby(
      q.longitude,
      q.latitude,
      pagination
    );
    return entities.map((e) => this.restaurantMapper.entityToDto(e));
  }
  @Get(':identifier')
  async findRestaurantByIdentifier(@Param('identifier') identifier: string): Promise<RestaurantOutDto> {
    const entity = await this.restaurantService.findByIdOrSlug(identifier);
    return this.restaurantMapper.entityToDto(entity);
  }
}