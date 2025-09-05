import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { Panel } from '../entities/panel.entity';
import { Speaker } from '../entities/speaker.entity';

@Injectable()
export class EventService {
  public constructor(@InjectRepository(Event) private readonly event: Repository<Event>) {}

  public getEvents(): Promise<Event[]> {
    return this.event.find();
  }

  public async postEvent(event: Event): Promise<void> {
    await this.event.save(event);
  }

  public async postPanel(panel: Panel): Promise<void> {
    await this.event.save(panel);
  }

  public async postSpeaker(speaker: Speaker): Promise<void> {
    await this.event.save(speaker);
  }
}
