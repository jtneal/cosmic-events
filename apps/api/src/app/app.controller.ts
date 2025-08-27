import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Event } from './entities/event.entity';

@Controller()
export class AppController {
  public constructor(private readonly events: AppService) {}

  @Get()
  public getData(): Promise<Event[]> {
    return this.events.getAll();
  }
}
