import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddFollowingDto {
  @ApiProperty({ type: String, description: 'Restaurant id or slug' })
  @IsString()
  restaurant_identifier!: string;
}
