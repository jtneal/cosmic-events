import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { Panel } from '../entities/panel.entity';
import { Speaker } from '../entities/speaker.entity';
import { EventController } from './event.controller';
import { EventMapper } from './event.mapper';
import { EventService } from './event.service';

@Module({
  controllers: [EventController],
  imports: [ConfigModule, TypeOrmModule.forFeature([Event, Panel, Speaker])],
  providers: [EventMapper, EventService],
})
export class EventModule {}
