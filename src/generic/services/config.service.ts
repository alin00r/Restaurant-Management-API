import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CONFIG_VARIABLE_CODES
} from '../constants/config.codes';
import { DatabaseConfig } from '../types/config.types';

@Injectable()
export class RestaurantConfigService {
  constructor(private readonly configService: ConfigService) {}

  get mode(): string {
    return this.configService.get<string>(CONFIG_VARIABLE_CODES.MODE) ?? 'DEV';
  }

  get port(): number {
    return parseInt(
      this.configService.getOrThrow<string>(CONFIG_VARIABLE_CODES.PORT)
    );
  }

  get databaseConfig(): DatabaseConfig {
    return {
      host: this.configService.getOrThrow<string>(
        CONFIG_VARIABLE_CODES.MONGODB_URI
      )
    };
  }

}
