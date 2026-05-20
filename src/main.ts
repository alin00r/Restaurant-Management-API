import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import mongoose from 'mongoose';
import { logExecutionTime, LoggerVerbosity } from 'mongoose-execution-time';
import * as qs from 'qs';
import { AppModule } from './app.module';
import { CONFIG_VARIABLE_CODES } from './generic/constants/config.codes';
import { isDebug, isDebugQueries } from './generic/utils/config.utils';


async function bootstrap(): Promise<void> {
  if (isDebugQueries()) {
    mongoose.plugin(logExecutionTime, {
      loggerLevel: 'log',
      logger: new Logger('MongooseExecutionTime'),
      loggerVerbosity: LoggerVerbosity.Normal
    });
    mongoose.set('debug', true);
  }

  let app: INestApplication;

  if (process.env['API_PLATFORM'] !== 'fastify') {
    const expressApp =
      await NestFactory.create<NestExpressApplication>(AppModule);
    expressApp.use(compression());
    expressApp.set('query parser', 'extended');
    app = expressApp;
  } else {
    app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({
        logger: isDebug(),
        ignoreTrailingSlash: true,
        querystringParser: (str) => qs.parse(str)
      })
    );
  }

  app.setGlobalPrefix('api/v1/');
  app.enableCors({
    origin: process.env['ALLOWED_ORIGINS']?.includes(',')
      ? process.env['ALLOWED_ORIGINS']?.split(',')
      : process.env['ALLOWED_ORIGINS']
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // Unknown object attributes will be rejected
      forbidUnknownValues: true,
      // Throw an exception for any property without validation decorators
      forbidNonWhitelisted: true,
      // Stop at first error for optimization purposes
      stopAtFirstError: true,
      // Required to enable the transformation of plain JSON into their respective class
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  );
  const config = new DocumentBuilder()
    .setTitle('Restaurant Management API')
    .setDescription('Part of Pleny - Software Engineer Task.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const fullDocumentation = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('full-docs', app, fullDocumentation, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha'
    }
  });

  const port = parseInt(process.env[CONFIG_VARIABLE_CODES.PORT] ?? '-1');
  if (isNaN(port) || port <= 0)
    throw new Error('PORT value must is required and must be an integer');
  await app.listen(port, '0.0.0.0');
}

bootstrap();
