import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { Event } from './entities/event.entity';
import { Panel } from './entities/panel.entity';
import { Speaker } from './entities/speaker.entity';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    EventModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        database: config.get<string>('DATABASE_NAME'),
        entities: [Event, Panel, Speaker],
        region: config.get<string>('DATABASE_REGION'),
        resourceArn: config.get<string>('DATABASE_RESOURCE_ARN'),
        secretArn: config.get<string>('DATABASE_SECRET_ARN'),
        type: 'aurora-postgres',
      }),
    }),
  ],
  providers: [
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
export class AppModule implements OnModuleInit {
  public constructor(private readonly dataSource: DataSource) {}

  public async onModuleInit(): Promise<void> {
    // Completely wipe out the database and recreate it
    await this.dataSource.synchronize(true);
  }
}
