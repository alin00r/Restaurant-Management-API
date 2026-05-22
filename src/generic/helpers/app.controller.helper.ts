import { BadRequestException, Injectable } from '@nestjs/common';
import { ERROR_CODES } from '../constants/error.codes';
import { isNotEmptyObject, isString } from 'class-validator';
import { LanguageService } from '../services/language.service';

@Injectable()
export class AppControllerHelper {
  constructor(
      private readonly languageService: LanguageService,
  ) {}

  checkIfSupportedLanguageOrThrow(languageCode: string): void {
    if (!this.languageService.isSupportedLanguage(languageCode))
      throw new BadRequestException(ERROR_CODES.UNSUPPORTED_LANGUAGE);
  }

  requireValidTranslations(
    translations: Record<string, string> | undefined
  ): void {
    if (!translations) return;
    if (!isNotEmptyObject(translations))
      throw new BadRequestException(ERROR_CODES.INVALID_PARAMETERS);
    for (const langCode in translations) {
      const value = translations[langCode];
      if (!value || !isString(value))
        throw new BadRequestException(ERROR_CODES.INVALID_PARAMETERS);
        this.checkIfSupportedLanguageOrThrow(langCode);
     }
  } 

}
