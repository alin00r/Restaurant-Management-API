import { Global, Module } from '@nestjs/common';
import { RestaurantConfigService,  } from './services/config.service';

@Global()
@Module({
  providers: [
 RestaurantConfigService
  ],
  exports: [
    RestaurantConfigService,
  ]
})
export class GenericModule {}
