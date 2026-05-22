import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';

export class TinyPaginationDto {
  @ApiProperty({
    type: Number,
    required: false,
    default: 0,
    description: 'The number of items to skip before starting to collect the result set'
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;

  @ApiProperty({
    type: Number,
    required: false,
    default: 10,
    description: 'The maximum number of items to return in the page. Minimum is 1 and maximum is 100'
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  constructor(args?: TinyPaginationDto) {
    this.offset = args?.offset ?? 0;
    this.limit = args?.limit ?? 10;
  }
}

export class SearchableTinyPaginationDto extends TinyPaginationDto {
  @ApiProperty({
    type: String,
    required: false,
    description: 'Optional cuisine filter used to match restaurants by cuisine'
  })
  @IsOptional()
  @IsString()
  cuisine?: string;

  constructor(args?: SearchableTinyPaginationDto) {
    super(args);
    this.cuisine = args?.cuisine;
  }
}