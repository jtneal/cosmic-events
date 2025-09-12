import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { memoryStorage } from 'multer';
import { Event } from '../entities/event.entity';
import { Panel } from '../entities/panel.entity';
import { Speaker } from '../entities/speaker.entity';
import { EventController } from './event.controller';
import { EventMapper } from './event.mapper';
import { EventService } from './event.service';

@Module({
  controllers: [EventController],
  imports: [
    ConfigModule,
    MulterModule.register({ storage: memoryStorage() }),
    TypeOrmModule.forFeature([Event, Panel, Speaker]),
  ],
  providers: [
    EventMapper,
    EventService,
    {
      inject: [ConfigService],
      provide: S3Client,
      useFactory: (config: ConfigService): S3Client => new S3Client({ region: config.get<string>('AWS_REGION') }),
    },
  ],
})
export class EventModule {}
