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
    // For new events (no ID), use regular save
    if (!event.id) {
      await this.event.save(event);
      return;
    }

    // For existing events, handle the update manually to avoid circular reference issues
    await this.event.manager.transaction(async (manager) => {
      // Update the main event entity
      await manager
        .createQueryBuilder()
        .update(Event)
        .set({
          description: event.description,
          endDate: event.endDate,
          image: event.image,
          isActive: event.isActive,
          isPublished: event.isPublished,
          location: event.location,
          marketingPoster: event.marketingPoster,
          organizerName: event.organizerName,
          organizerUrl: event.organizerUrl,
          price: event.price,
          purchaseLink: event.purchaseLink,
          startDate: event.startDate,
          title: event.title,
          type: event.type,
          userId: event.userId,
          website: event.website,
        })
        .where('id = :id::uuid', { id: event.id })
        .execute();

      // Delete existing panels and speakers, then insert new ones
      await manager
        .createQueryBuilder()
        .delete()
        .from('Panel')
        .where('event.id = :eventId::uuid', { eventId: event.id })
        .execute();

      await manager
        .createQueryBuilder()
        .delete()
        .from('Speaker')
        .where('event.id = :eventId::uuid', { eventId: event.id })
        .execute();

      // Insert new panels
      if (event.panels && event.panels.length > 0) {
        for (const panel of event.panels) {
          await manager
            .createQueryBuilder()
            .insert()
            .into('Panel')
            .values({
              description: panel.description,
              title: panel.title,
              userId: panel.userId,
              event: { id: event.id },
            })
            .execute();
        }
      }

      // Insert new speakers
      if (event.speakers && event.speakers.length > 0) {
        for (const speaker of event.speakers) {
          await manager
            .createQueryBuilder()
            .insert()
            .into('Speaker')
            .values({
              description: speaker.description,
              image: speaker.image,
              name: speaker.name,
              userId: speaker.userId,
              event: { id: event.id },
            })
            .execute();
        }
      }
    });
  }

  public async deleteEvent(eventId: string): Promise<void> {
    await this.event.delete(eventId);
  }
}
