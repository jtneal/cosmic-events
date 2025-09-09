import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';

@Injectable()
export class EventService {
  public constructor(@InjectRepository(Event) private readonly event: Repository<Event>) {}

  public getEvents(): Promise<Event[]> {
    return this.event.find();
  }

  public async getEvent(eventId: string): Promise<Event> {
    const event = await this.event
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.panels', 'panels')
      .leftJoinAndSelect('event.speakers', 'speakers')
      .where('event.id = :id::uuid', { id: eventId })
      .getOne();

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    return event;
  }

  public getUserEvents(userId: string): Promise<Event[]> {
    return this.event.find({ where: { userId } });
  }

  public async postEvent(event: Event): Promise<void> {
    await this.event.save(event);
  }

  public async deleteEvent(eventId: string): Promise<void> {
    await this.event.delete(eventId);
  }
}
