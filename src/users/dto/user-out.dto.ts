import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '../../generic/types/base-out.dto';
import { EntityId } from '../../generic/types/entity-id.type';


export class UserOutDto extends BaseOutDto {
  @ApiProperty({
    type: String,
    nullable: false,
    description: 'The full name of the user',
    example: 'Ali Nour'
  })
  fullname: string;
  @ApiProperty({
    type: [String],
    nullable: false,
    description: 'List of the user favorite cuisines',
    example: ['koshary', 'Casserole']
  })
  favorite_cuisines: string[];
  @ApiProperty({
    type: [String],
    nullable: false,
    description: 'List of user ids that the user is following',
    example: ['mongoId1', 'mongoId2']
  })
  following: EntityId[];


  constructor(args: UserOutDto) {
    super(args);
    this.fullname = args.fullname;
    this.favorite_cuisines = args.favorite_cuisines;
    this.following = args.following;
  }
}