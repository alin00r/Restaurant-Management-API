import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppRepositoryHelper } from '../../generic/helpers/app.repository.helper';
import { AppBaseRepository } from '../../generic/repository/repository-base.repository';
import { UserEntity } from '../entities/user.entity';
import { EntityId } from '../../generic/types/entity-id.type';
import { RestaurantEntity } from '../../restaurants/entities/restaurant.entity';

export interface UserRecommendationsAggregationResult {
  users: {
    id: string;
    fullname: string;
    favorite_cuisines: string[];
  }[];
  restaurants: {
    id: string;
    slug: string;
    translations: Record<string, string>;
    cuisines: string[];
  }[];
}


@Injectable()
export class UserRepository extends AppBaseRepository<UserEntity> {
  constructor(
    @InjectModel(UserEntity.name)
    override readonly model: Model<UserEntity>,
    @InjectModel(RestaurantEntity.name)
    private readonly restaurantModel: Model<RestaurantEntity>,
    override readonly repoHelper: AppRepositoryHelper
  ) {
    super(
      model,
      [[]],
      repoHelper,
      new Logger(UserRepository.name),
      [],
    );
  }

  async getRecommendationsByUserId(
    userId: EntityId
  ): Promise<UserRecommendationsAggregationResult> {
    const usersCollection = this.model.collection.name;
    const restaurantsCollection = this.restaurantModel.collection.name;

    const [result] = await this.model
      .aggregate<UserRecommendationsAggregationResult>([
        {
          $match: {
            _id: userId
          }
        },
        {
          $lookup: {
            from: usersCollection,
            let: {
              targetUserId: '$_id',
              targetCuisines: '$favorite_cuisines'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $ne: ['$_id', '$$targetUserId'] },
                      {
                        $gt: [
                          {
                            $size: {
                              $setIntersection: [
                                { $ifNull: ['$favorite_cuisines', []] },
                                { $ifNull: ['$$targetCuisines', []] }
                              ]
                            }
                          },
                          0
                        ]
                      }
                    ]
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  fullname: 1,
                  favorite_cuisines: { $ifNull: ['$favorite_cuisines', []] },
                  following: { $ifNull: ['$following', []] }
                }
              }
            ],
            as: 'similar_users'
          }
        },
        {
          $project: {
            users: {
              $map: {
                input: '$similar_users',
                as: 'u',
                in: {
                  id: { $toString: '$$u._id' },
                  fullname: '$$u.fullname',
                  favorite_cuisines: '$$u.favorite_cuisines'
                }
              }
            },
            followed_restaurant_ids: {
              $reduce: {
                input: {
                  $map: {
                    input: '$similar_users',
                    as: 'u',
                    in: '$$u.following'
                  }
                },
                initialValue: [],
                in: { $setUnion: ['$$value', '$$this'] }
              }
            }
          }
        },
        {
          $lookup: {
            from: restaurantsCollection,
            let: {
              followedRestaurantIds: '$followed_restaurant_ids'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ['$_id', '$$followedRestaurantIds']
                  }
                }
              },
              {
                $project: {
                  id: { $toString: '$_id' },
                  slug: 1,
                  translations: 1,
                  cuisines: { $ifNull: ['$cuisines', []] }
                }
              }
            ],
            as: 'restaurants'
          }
        },
        {
          $project: {
            users: 1,
            restaurants: 1
          }
        }
      ])
      .exec();

    return result ?? { users: [], restaurants: [] };
  }

  async addFollowing(userId: EntityId, restaurantId: EntityId) {
    await this.model.updateOne({ _id: userId }, { $addToSet: { following: restaurantId } }).exec();
    await this.restaurantModel.updateOne({ _id: restaurantId }, { $addToSet: { followers: userId } }).exec();
    const updated = await this.model.findById(userId).lean().exec();
    return updated as unknown as UserEntity;
  }

  async findRestaurantByIdentifier(identifier: string) {
    const normalized = identifier;
    if (/^[0-9a-fA-F]{24}$/.test(normalized)) {
      const byId = await this.restaurantModel.findById(normalized).lean().exec();
      if (byId) return byId as unknown as RestaurantEntity;
    }
    const bySlug = await this.restaurantModel.findOne({ slug: normalized }).lean().exec();
    return bySlug as unknown as RestaurantEntity | null;
  }

  async findAllUsers(): Promise<UserEntity[]> {
    const users = await this.model.find({}).lean().exec();
    return users as unknown as UserEntity[];
  }

  async addRestaurantToFollowing(
    userId: EntityId,
    restaurantId: EntityId
  ): Promise<UserEntity | null> {
    const restaurantExists = await this.restaurantModel.exists({ _id: restaurantId });
    if (!restaurantExists) {
      return null;
    }

    const updatedUser = await this.model
      .findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            following: restaurantId
          }
        },
        {
          new: true,
          lean: true
        }
      )
      .exec();

    if (!updatedUser) {
      return null;
    }

    await this.restaurantModel
      .updateOne(
        { _id: restaurantId },
        {
          $addToSet: {
            followers: userId
          }
        }
      )
      .exec();

    return updatedUser as unknown as UserEntity;
  }

}