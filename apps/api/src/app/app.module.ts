import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { Event } from './entities/event.entity';
import { Organizer } from './entities/organizer.entity';
import { Panel } from './entities/panel.entity';
import { Speaker } from './entities/speaker.entity';
import { EventService } from './event.service';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        database: config.get<string>('DATABASE_NAME'),
        entities: [Event, Organizer, Panel, Speaker],
        region: config.get<string>('DATABASE_REGION'),
        resourceArn: config.get<string>('DATABASE_RESOURCE_ARN'),
        secretArn: config.get<string>('DATABASE_SECRET_ARN'),
        // synchronize: true, // always false in production
        type: 'aurora-postgres',
      }),
    }),
    TypeOrmModule.forFeature([Event]),
  ],
  providers: [EventService],
})
export class AppModule {}
