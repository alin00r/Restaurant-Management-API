import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayMinSize, ArrayMaxSize, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: String, example: 'Ali Nour' })
  @IsString()
  fullname!: string;

  @ApiProperty({ type: [String], example: ['koshary', 'egyptian'], required: false })
  @IsOptional()
  @IsArray()
  favorite_cuisines?: string[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  following?: string[];
}
