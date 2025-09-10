import { EventTypeEnum } from '@cosmic-events/util-dtos';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, MoreThanOrEqual, Repository } from 'typeorm';
import { Event } from '../entities/event.entity';

export interface EventFilters {
  endDate: string;
  location: string;
  search: string;
  sort: string;
  startDate: string;
  type: string;
}

@Injectable()
export class EventService {
  public constructor(@InjectRepository(Event) private readonly event: Repository<Event>) {}

  public getEvents(filters: EventFilters): Promise<Event[]> {
    const query = this.event
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.panels', 'panels')
      .leftJoinAndSelect('event.speakers', 'speakers');

    if (filters.location) {
      query.andWhere('event.location IN (:...locations)', { locations: filters.location.split(',') });
    }

    if (filters.type) {
      query.andWhere('event.type::text IN (:...types)', { types: filters.type.split(',') });
    }

    if (filters.startDate) {
      query.andWhere('event.startDate >= :startDate', { startDate: new Date(filters.startDate) });
    }

    if (filters.endDate) {
      query.andWhere('event.endDate <= :endDate', { endDate: new Date(filters.endDate) });
    }

    if (filters.search) {
      query.andWhere('LOWER(event.title) LIKE :search OR LOWER(event.description) LIKE :search', {
        search: `%${filters.search.toLowerCase()}%`,
      });
    }

    if (filters.sort === 'price-asc') {
      query.orderBy('event.price', 'ASC');
    } else if (filters.sort === 'price-desc') {
      query.orderBy('event.price', 'DESC');
    } else if (filters.sort === 'date-asc') {
      query.orderBy('event.startDate', 'ASC');
    } else if (filters.sort === 'date-desc') {
      query.orderBy('event.startDate', 'DESC');
    }

    return query.getMany();
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
