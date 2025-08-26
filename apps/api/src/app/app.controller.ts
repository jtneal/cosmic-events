import { Controller, Get } from '@nestjs/common';
import { Event } from './entities/event.entity';
import { EventService } from './event.service';

@Controller()
export class AppController {
  public constructor(private readonly events: EventService) {}

  @Get()
  public getData(): Promise<Event[]> {
    return this.events.getAll();
  }
}
