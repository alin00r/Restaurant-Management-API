import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { UserRepository } from './repository/user.repository';
import { UserMapper } from './mapper/user.mapper';
import { UserEntity, UserSchema } from './entities/user.entity';
import {
  RestaurantEntity,
  RestaurantSchema
} from '../restaurants/entities/restaurant.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserEntity.name, schema: UserSchema },
      { name: RestaurantEntity.name, schema: RestaurantSchema }
    ])
  ],
  controllers: [UserController],
  providers: [
    UserService, 
    UserRepository, 
    UserMapper
  ],
  exports: [UserService]
})
export class UserModule {}