import mongoose from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AddFollowingDto } from './dto/add-following.dto';

describe('UserService', () => {
  const userId = new mongoose.Types.ObjectId();
  const restaurantId = new mongoose.Types.ObjectId();

  const sampleUser = {
    _id: userId,
    created_at: new Date(),
    updated_at: new Date(),
    fullname: 'Test User',
    favorite_cuisines: ['koshary'],
    following: []
  } as any;

  const sampleRestaurant = {
    _id: restaurantId,
    slug: 'sample-restaurant',
    translations: { en: 'Sample' },
    cuisines: ['koshary']
  } as any;

  let mockRepo: any;
  let service: UserService;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn().mockResolvedValue(sampleUser),
      findAll: jest.fn().mockResolvedValue([sampleUser]),
      findOneByIdentifier: jest.fn().mockResolvedValue(sampleUser),
      findRestaurantByIdentifier: jest.fn().mockResolvedValue(sampleRestaurant),
      addFollowing: jest.fn().mockResolvedValue({ ...sampleUser, following: [restaurantId] }),
      getRecommendationsByUserId: jest.fn().mockResolvedValue({
        users: [
          { id: userId.toString(), fullname: 'Other', favorite_cuisines: ['koshary'] }
        ],
        restaurants: [
          { id: restaurantId.toString(), slug: 'sample-restaurant', translations: { en: 'Sample' }, cuisines: ['koshary'] }
        ]
      })
    };

    service = new UserService(mockRepo);
  });

  it('creates a user', async () => {
    const dto: CreateUserDto = { fullname: 'Test User', favorite_cuisines: ['koshary'] } as any;
    const out = await service.create(dto);
    expect(mockRepo.create).toHaveBeenCalled();
    expect(out.fullname).toBe('Test User');
    expect(out.favorite_cuisines).toEqual(['koshary']);
  });

  it('returns all users', async () => {
    const out = await service.findAll();
    expect(mockRepo.findAll).toHaveBeenCalled();
    expect(Array.isArray(out)).toBe(true);
    expect(out[0].fullname).toBe('Test User');
  });

  it('finds user by identifier', async () => {
    const out = await service.findByIdentifier(userId.toString());
    expect(mockRepo.findOneByIdentifier).toHaveBeenCalledWith(userId.toString());
    expect(out.fullname).toBe('Test User');
  });

  it('adds following to user', async () => {
    const dto: AddFollowingDto = { restaurant_identifier: restaurantId.toString() } as any;
    const out = await service.addFollowing(userId.toString(), dto);
    expect(mockRepo.findOneByIdentifier).toHaveBeenCalled();
    expect(mockRepo.findRestaurantByIdentifier).toHaveBeenCalledWith(dto.restaurant_identifier);
    expect(mockRepo.addFollowing).toHaveBeenCalled();
    expect(out.following).toHaveLength(1);
  });

  it('returns recommendations', async () => {
    const out = await service.getRecommendations(userId.toString());
    expect(mockRepo.getRecommendationsByUserId).toHaveBeenCalledWith(userId);
    expect(out.users.length).toBeGreaterThan(0);
    expect(out.restaurants.length).toBeGreaterThan(0);
  });

  it('throws when user not found in recommendations', async () => {
    mockRepo.findOneByIdentifier.mockResolvedValue(null);
    await expect(service.getRecommendations('notfound')).rejects.toBeInstanceOf(NotFoundException);
  });
});
