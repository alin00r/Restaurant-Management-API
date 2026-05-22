import { Global, Module } from '@nestjs/common';
import { RestaurantConfigService } from './services/config.service';
import { AppRepositoryHelper } from './helpers/app.repository.helper';
import { AppControllerHelper } from './helpers/app.controller.helper';
import { LanguageService } from './services/language.service';

@Global()
@Module({
  providers: [LanguageService,RestaurantConfigService, AppRepositoryHelper, AppControllerHelper],
  exports: [LanguageService, RestaurantConfigService, AppRepositoryHelper, AppControllerHelper]
})
export class GenericModule {}
