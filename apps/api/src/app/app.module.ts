import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';
import { AuthModule } from './auth/auth.module';
import { Event } from './entities/event.entity';
import { Panel } from './entities/panel.entity';
import { Speaker } from './entities/speaker.entity';
import { EventModule } from './event/event.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    EventModule,
    HealthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        database: config.get<string>('DATABASE_NAME'),
        dropSchema: true,
        entities: [Event, Panel, Speaker],
        region: config.get<string>('AWS_REGION'),
        resourceArn: config.get<string>('DATABASE_RESOURCE_ARN'),
        secretArn: config.get<string>('DATABASE_SECRET_ARN'),
        synchronize: true,
        type: 'aurora-postgres',
      }),
    }),
  ],
  providers: [
    {
      inject: [ConfigService],
      provide: RedisStore,
      useFactory: (config: ConfigService): RedisStore => {
        const redisClient = createClient({ url: config.get<string>('CACHE_URL') });

        redisClient.connect().catch(console.error);

        return new RedisStore({ client: redisClient, prefix: 'cosmic:' });
      },
    },
  ],
})
export class AppModule {}
