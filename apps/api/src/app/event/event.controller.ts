import { EventDto } from '@cosmic-events/util-dtos';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { Event } from '../entities/event.entity';
import { Panel } from '../entities/panel.entity';
import { Speaker } from '../entities/speaker.entity';
import { EventMapper } from './event.mapper';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  public constructor(private readonly event: EventService, private readonly mapper: EventMapper) {}

  @Get()
  public getData(): Promise<Event[]> {
    return this.event.getEvents();
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: EventDto })
  public async postEvent(@Body() event: EventDto): Promise<void> {
    const panels: Panel[] = [];
    const speakers: Speaker[] = [];

    for (const panelDto of event.panels) {
      const panel = this.mapper.toPanel(panelDto);

      await this.event.postPanel(panel);

      panels.push(panel);
    }

    for (const speakerDto of event.speakers) {
      const speaker = this.mapper.toSpeaker(speakerDto);

      await this.event.postSpeaker(speaker);

      speakers.push(speaker);
    }

    await this.event.postEvent(this.mapper.toEvent(event, panels, speakers));
  }
}
