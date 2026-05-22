import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from './repository/user.repository';
import { ERROR_CODES } from '../generic/constants/error.codes';
import { UserRecommendationsOutDto } from './dto/user-recommendations-out.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserOutDto } from './dto/user-out.dto';
import { AddFollowingDto } from './dto/add-following.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
  ) {}

  async getRecommendations(identifier: string): Promise<UserRecommendationsOutDto> {
    const user = await this.userRepo.findOneByIdentifier(identifier);
    if (!user) {
      throw new NotFoundException(ERROR_CODES.USER_NOT_FOUND);
    }
    const recommendations = await this.userRepo.getRecommendationsByUserId(user._id);
    return new UserRecommendationsOutDto(recommendations);
  }

  async create(dto: CreateUserDto): Promise<UserOutDto> {
    const entity = new UserEntity({
      fullname: dto.fullname,
      favorite_cuisines: dto.favorite_cuisines ?? [],
      following: (dto.following ?? []) as any
    });
    const created = await this.userRepo.create(entity as unknown as any);
    return new UserOutDto({
      id: created._id.toString(),
      created_at: created.created_at.getTime(),
      updated_at: created.updated_at.getTime(),
      fullname: created.fullname,
      favorite_cuisines: created.favorite_cuisines,
      following: created.following
    });
  }

  async findAll(): Promise<UserOutDto[]> {
    const docs = await this.userRepo.findAll();
    return (docs as UserEntity[]).map((e) => new UserOutDto({
      id: e._id.toString(),
      created_at: e.created_at.getTime(),
      updated_at: e.updated_at.getTime(),
      fullname: e.fullname,
      favorite_cuisines: e.favorite_cuisines,
      following: e.following
    }));
  }

  async findByIdentifier(identifier: string): Promise<UserOutDto> {
    const doc = await this.userRepo.findOneByIdentifier(identifier);
    if (!doc) throw new NotFoundException(ERROR_CODES.USER_NOT_FOUND);
    const e = doc as unknown as UserEntity;
    return new UserOutDto({
      id: e._id.toString(),
      created_at: e.created_at.getTime(),
      updated_at: e.updated_at.getTime(),
      fullname: e.fullname,
      favorite_cuisines: e.favorite_cuisines,
      following: e.following
    });
  }

  async addFollowing(identifier: string, dto: AddFollowingDto): Promise<UserOutDto> {
    const user = await this.userRepo.findOneByIdentifier(identifier);
    if (!user) throw new NotFoundException(ERROR_CODES.USER_NOT_FOUND);

    const restaurant = await this.userRepo.findRestaurantByIdentifier(dto.restaurant_identifier);
    if (!restaurant) throw new NotFoundException(ERROR_CODES.RESTAURANT_NOT_FOUND);

    const updated = await this.userRepo.addFollowing(user._id, restaurant._id);
    const e = updated as unknown as UserEntity;
    return new UserOutDto({
      id: e._id.toString(),
      created_at: e.created_at.getTime(),
      updated_at: e.updated_at.getTime(),
      fullname: e.fullname,
      favorite_cuisines: e.favorite_cuisines,
      following: e.following
    });
  }

}