import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantModule } from './restaurants/restaurants.module';
import { CONFIG_VALIDATION_JOI } from './generic/constants/config.codes';
import { RestaurantConfigService } from './generic/services/config.service';
import { GenericModule } from './generic/generic.module';


@Module({
  imports: [
      ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validationSchema: CONFIG_VALIDATION_JOI
    }),
      GenericModule,
      MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [RestaurantConfigService],
      useFactory: async (configService: RestaurantConfigService) => ({
        uri: configService.databaseConfig.host
      })
    }),
    RestaurantModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
