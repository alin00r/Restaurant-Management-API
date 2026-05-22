import { ApiProperty } from '@nestjs/swagger';

export class TinyBaseOutDto {
  @ApiProperty({ type: String, required: true })
  id: string;

  constructor(args: TinyBaseOutDto) {
    this.id = args.id;
  }
}

export class BaseOutDto extends TinyBaseOutDto {
  @ApiProperty({
    type: Number,
    required: true,
    description: 'The timestamp in ms in which this instance was created'
  })
  created_at: number;

  @ApiProperty({
    type: Number,
    required: true,
    description:
      'The timestamp in ms in which the instance was last updated (Initialy equals to created_at)'
  })
  updated_at: number;

  constructor(args: BaseOutDto) {
    super(args);
    this.created_at = args.created_at;
    this.updated_at = args.updated_at;
  }
}
