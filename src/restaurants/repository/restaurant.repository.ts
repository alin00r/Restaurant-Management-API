import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppRepositoryHelper } from '../../generic/helpers/app.repository.helper';
import { AppBaseRepository } from '../../generic/repository/repository-base.repository';
import { RestaurantEntity } from '../entities/restaurant.entity';

@Injectable()
export class RestaurantRepository extends AppBaseRepository<RestaurantEntity> {
  constructor(
    @InjectModel(RestaurantEntity.name)
    override readonly model: Model<RestaurantEntity>,
    override readonly repoHelper: AppRepositoryHelper
  ) {
    super(
      model,
      [['slug']],
      repoHelper,
      new Logger(RestaurantRepository.name),
      [],
    );
  }

  async findAllWithFilters(
    pagination: { offset?: number; limit?: number } | any,
    cuisine?: string
  ): Promise<RestaurantEntity[]> {
    const condition: any = {};
    if (cuisine) {
      condition.cuisines = cuisine;
    }
    const offset = pagination?.offset ?? 0;
    const limit = pagination?.limit ?? 10;

    const docs = await this.findManyByCondition({
      condition,
      skip: offset,
      limit
    });

    return docs as unknown as RestaurantEntity[];
  }
  
  async findNearby(
    longitude: number,
    latitude: number,
    pagination: { offset?: number; limit?: number } | any
  ): Promise<RestaurantEntity[]> {
    const condition: any = {
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: 1000
        }
      }
    };

    const offset = pagination?.offset ?? 0;
    const limit = pagination?.limit ?? 10;

    const docs = await this.model
      .find(condition)
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();

    return docs as unknown as RestaurantEntity[];
  }
}