import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CONFIG_MULTI_VALUE_SEPARATOR,
  CONFIG_VARIABLE_CODES
} from '../constants/config.codes';

@Injectable()
export class LanguageService implements OnModuleInit {
  // Use a set for performance optimization
  private supportedLanguages: Set<string> = new Set();

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    this.supportedLanguages = new Set();
    let languagesCombined = this.configService.get<string>(
      CONFIG_VARIABLE_CODES.SUPPORTED_LANGUAGES
    );
    // Set the default language if it is empty
    if (!languagesCombined) languagesCombined = 'en';
    // Add the supported languages to the set
    languagesCombined
      .split(CONFIG_MULTI_VALUE_SEPARATOR)
      .forEach((lang: string) =>
        this.supportedLanguages.add(lang.trim().toLowerCase())
      );
  }

  getSupportedLanguages(): string[] {
    return [...this.supportedLanguages];
  }

  isSupportedLanguage(languageCode: string): boolean {
    return this.supportedLanguages.has(languageCode.trim().toLowerCase());
  }
}
