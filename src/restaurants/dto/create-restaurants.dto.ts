import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';
import { Trim } from '../../common/decorators/trim.decorator';

export class CreateRestaurantDto {
  @ApiProperty({
    type: Object,
    additionalProperties: { type: 'string' },
    example: { en: 'Name in English', ar: 'Name in Arabic' },
    required: true
  })
  @IsNotEmpty()
  translations!: Record<string, string>;

  @ApiProperty({ type: String, required: true, example: 'koshary-aboutarek' })
  @IsNotEmpty()
  @IsString()
  @Trim()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be a valid lowercase URL-friendly string'
  })
  slug!: string;

  @ApiProperty({
    type: [String],
    example: ['koshary', 'Casserole'],
    required: true,
    description: 'List of cuisines linked to the restaurant (between 1 and 3 items)'
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  cuisines!: string[];

  @ApiProperty({ type: Number, required: true, example: 30.051493 })
  @IsNotEmpty()
  @IsNumber()
  @IsLongitude()
  longitude!: number;

  @ApiProperty({ type: Number, required: true, example: 31.233054 })
  @IsNotEmpty()
  @IsNumber()
  @IsLatitude()
  latitude!: number;
}