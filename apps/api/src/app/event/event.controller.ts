import { EventDto, UserDto } from '@cosmic-events/util-dtos';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  SerializeOptions,
  Session,
  UseInterceptors,
} from '@nestjs/common';
import { EventMapper } from './event.mapper';
import { EventService } from './event.service';

@Controller()
export class EventController {
  public constructor(private readonly event: EventService, private readonly mapper: EventMapper) {}

  @Get('events')
  public async getEvents(): Promise<EventDto[]> {
    const events = await this.event.getEvents();

    return events.map((event) => this.mapper.toEventDto(event));
  }

  @Get('user/events')
  public async getUserEvents(@Session() session: UserDto): Promise<EventDto[]> {
    const events = await this.event.getUserEvents(session.userId);

    return events.map((event) => this.mapper.toEventDto(event));
  }

  @Post('events')
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: EventDto })
  public postEvent(@Body() event: EventDto, @Session() session: UserDto): Promise<void> {
    return this.event.postEvent(this.mapper.toEvent(event, session.userId));
  }
}
