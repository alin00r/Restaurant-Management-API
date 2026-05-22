import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { TinyPaginationDto } from '../../generic/types/pagination.tiny.dto';

export class NearbyRestaurantsDto extends TinyPaginationDto {
  @ApiProperty({ type: Number, required: true, example: 30.051493})
  @Type(() => Number)
  @IsLongitude()
  longitude!: number;

  @ApiProperty({ type: Number, required: true, example: 31.233054})
  @Type(() => Number)
  @IsLatitude()
  latitude!: number;

  constructor(args?: Partial<NearbyRestaurantsDto>) {
    super(args as any);
    this.longitude = args?.longitude as number;
    this.latitude = args?.latitude as number;
  }
}
