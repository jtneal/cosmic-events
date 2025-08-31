import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Event } from './entities/event.entity';
import { Organizer } from './entities/organizer.entity';
import { Panel } from './entities/panel.entity';
import { Speaker } from './entities/speaker.entity';

@Module({
  controllers: [AppController],
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Event]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        database: config.get<string>('DATABASE_NAME'),
        entities: [Event, Organizer, Panel, Speaker],
        region: config.get<string>('DATABASE_REGION'),
        resourceArn: config.get<string>('DATABASE_RESOURCE_ARN'),
        secretArn: config.get<string>('DATABASE_SECRET_ARN'),
        // synchronize: true,
        type: 'aurora-postgres',
      }),
    }),
  ],
  providers: [
    AppService,
    {
      inject: [ConfigService],
      provide: RedisStore,
      useFactory: (config: ConfigService): RedisStore => {
        const redisClient = createClient({ url: config.get<string>('REDIS_URL') });

        redisClient.connect().catch(console.error);

        return new RedisStore({ client: redisClient, prefix: 'cosmic:' });
      },
    },
  ],
})
export class AppModule {}
