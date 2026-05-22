import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantController } from './restaurants.controller';
import { RestaurantService } from './restaurants.service';
import { RestaurantRepository } from './repository/restaurant.repository';
import { RestaurantMapper } from './mapper/restruatnts.mapper';
import { RestaurantEntity, RestaurantSchema } from './entities/restaurant.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RestaurantEntity.name, schema: RestaurantSchema }
    ])
  ],
  controllers: [RestaurantController],
  providers: [
    RestaurantService, 
    RestaurantRepository, 
    RestaurantMapper
  ],
  exports: [RestaurantService]
})
export class RestaurantModule {}