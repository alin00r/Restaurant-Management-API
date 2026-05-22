import { ApiProperty } from '@nestjs/swagger';

export class RecommendedUserOutDto {
  @ApiProperty({ type: String, example: '6830ace7f9cdca7bb08f7684' })
  id: string;

  @ApiProperty({ type: String, example: 'Ali Nour' })
  fullname: string;

  @ApiProperty({
    type: [String],
    example: ['koshary', 'casserole']
  })
  favorite_cuisines: string[];

  constructor(args: RecommendedUserOutDto) {
    this.id = args.id;
    this.fullname = args.fullname;
    this.favorite_cuisines = args.favorite_cuisines;
  }
}

export class RecommendedRestaurantOutDto {
  @ApiProperty({ type: String, example: '6830ace7f9cdca7bb08f7622' })
  id: string;

  @ApiProperty({ type: String, example: 'koshary-aboutarek' })
  slug: string;

  @ApiProperty({
    type: Object,
    additionalProperties: { type: 'string' },
    example: {
      en: 'Koshary Abou Tarek',
      ar: 'كشري أبو طارق'
    }
  })
  translations: Record<string, string>;

  @ApiProperty({
    type: [String],
    example: ['koshary', 'egyptian']
  })
  cuisines: string[];

  constructor(args: RecommendedRestaurantOutDto) {
    this.id = args.id;
    this.slug = args.slug;
    this.translations = args.translations;
    this.cuisines = args.cuisines;
  }
}

export class UserRecommendationsOutDto {
  @ApiProperty({ type: [RecommendedUserOutDto] })
  users: RecommendedUserOutDto[];

  @ApiProperty({ type: [RecommendedRestaurantOutDto] })
  restaurants: RecommendedRestaurantOutDto[];

  constructor(args: UserRecommendationsOutDto) {
    this.users = args.users.map((user) => new RecommendedUserOutDto(user));
    this.restaurants = args.restaurants.map(
      (restaurant) => new RecommendedRestaurantOutDto(restaurant)
    );
  }
}
