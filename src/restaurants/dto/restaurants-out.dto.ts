import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '../../generic/types/base-out.dto';


export class RestaurantOutDto extends BaseOutDto {
  @ApiProperty({
    type: Object,
    additionalProperties: { type: 'string' }
  })
  translations: Record<string, string>;

  @ApiProperty({
    type: String,
    nullable: false,
    description: 'The unique URL slug identifier of the restaurant',
    example: 'koshary-aboutarek'
  })
  slug: string;

  @ApiProperty({
    type: [String],
    nullable: false,
    description: 'List of cuisines assigned to the restaurant',
    example: ['koshary', 'Casserole']
  })
  cuisines: string[];

  @ApiProperty({
    type: Number,
    nullable: false,
    description: 'Geographic longitude coordinate extracted from the restaurant location',
    example: 30.051493
  })
  longitude: number;

  @ApiProperty({
    type: Number,
    nullable: false,
    description: 'Geographic latitude coordinate extracted from the restaurant location',
    example: 31.233054
  })
  latitude: number;

  constructor(args: RestaurantOutDto) {
    super(args);
    this.translations = args.translations;
    this.slug = args.slug;
    this.cuisines = args.cuisines;
    this.longitude = args.longitude;
    this.latitude = args.latitude;
  }
}