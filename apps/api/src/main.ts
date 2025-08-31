import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RedisStore } from 'connect-redis';
import session from 'express-session';
import { AppModule } from './app/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  const port = process.env.PORT || 3000;
  const config = app.get<ConfigService>(ConfigService);
  const redisStore = app.get<RedisStore>(RedisStore);

  app.setGlobalPrefix(globalPrefix);
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: config.get<string>('SESSION_SECRET') ?? '',
      store: redisStore,
    })
  );

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
