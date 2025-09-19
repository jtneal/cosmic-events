import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { Panel } from '../entities/panel.entity';
import { Speaker } from '../entities/speaker.entity';

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

  public async incrementImpressions(filters: EventFilters): Promise<void> {
    const query = this.event
      .createQueryBuilder()
      .update(Event)
      .set({ impressions: () => '"impressions" + 1' })
      .andWhere('isActive = true')
      .andWhere('isPublished = true');

    if (filters.location) {
      query.andWhere('location IN (:...locations)', { locations: filters.location.split(',') });
    }

    if (filters.type) {
      query.andWhere('type::text IN (:...types)', { types: filters.type.split(',') });
    }

    if (filters.startDate) {
      query.andWhere('startDate >= :startDate', { startDate: new Date(filters.startDate) });
    }

    if (filters.endDate) {
      query.andWhere('endDate <= :endDate', { endDate: new Date(filters.endDate) });
    }

    if (filters.search) {
      query.andWhere(
        'LOWER(title) LIKE :search OR LOWER(subtitle) LIKE :search OR LOWER(event.description) LIKE :search',
        {
          search: `%${filters.search.toLowerCase()}%`,
        },
      );
    }

    await query.execute();
  }

  public async incrementViews(eventId: string): Promise<void> {
    const query = this.event
      .createQueryBuilder()
      .update(Event)
      .set({ views: () => '"views" + 1' })
      .andWhere('isActive = true')
      .andWhere('isPublished = true')
      .andWhere('event.id = :eventId::uuid', { eventId });

    await query.execute();
  }

  public async incrementOrganizerUrlClicks(eventId: string): Promise<void> {
    const query = this.event
      .createQueryBuilder()
      .update(Event)
      .set({ organizerUrlClicks: () => '"organizerUrlClicks" + 1' })
      .andWhere('event.id = :eventId::uuid', { eventId });

    await query.execute();
  }

  public async incrementPurchaseLinkClicks(eventId: string): Promise<void> {
    const query = this.event
      .createQueryBuilder()
      .update(Event)
      .set({ purchaseLinkClicks: () => '"purchaseLinkClicks" + 1' })
      .andWhere('event.id = :eventId::uuid', { eventId });

    await query.execute();
  }

  public async incrementWebsiteClicks(eventId: string): Promise<void> {
    const query = this.event
      .createQueryBuilder()
      .update(Event)
      .set({ websiteClicks: () => '"websiteClicks" + 1' })
      .andWhere('event.id = :eventId::uuid', { eventId });

    await query.execute();
  }

  public async incrementEventClicks(eventId: string): Promise<void> {
    const query = this.event
      .createQueryBuilder()
      .update(Event)
      .set({ clicks: () => '"clicks" + 1' })
      .andWhere('event.id = :eventId::uuid', { eventId });

    await query.execute();
  }

  public getEvents(filters: EventFilters): Promise<Event[]> {
    const query = this.event
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.panels', 'panels')
      .leftJoinAndSelect('event.speakers', 'speakers')
      .andWhere('event.isActive = true')
      .andWhere('event.isPublished = true');

    if (filters.location) {
      let locations: string[] = [];

      try {
        locations = JSON.parse(filters.location);
      } catch {
        console.error('Error parsing location filter:', filters.location);
      }

      if (locations.length) {
        query.andWhere('event.location IN (:...locations)', { locations });
      }
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
      query.andWhere(
        'LOWER(event.title) LIKE :search OR LOWER(event.subtitle) LIKE :search OR LOWER(event.description) LIKE :search',
        {
          search: `%${filters.search.toLowerCase()}%`,
        },
      );
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
      .andWhere('event.isActive = true')
      .andWhere('event.isPublished = true')
      .andWhere('event.id = :eventId::uuid', { eventId })
      .getOne();

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    return event;
  }

  public async getLocations(): Promise<string[]> {
    const locations = await this.event
      .createQueryBuilder('event')
      .select('DISTINCT event.location', 'location')
      .andWhere('event.isActive = true')
      .andWhere('event.isPublished = true')
      .orderBy('event.location', 'ASC')
      .getRawMany();

    return locations.map((x) => x.location);
  }

  public getUserEvents(userId: string): Promise<Event[]> {
    return this.event.find({ where: { userId } });
  }

  public async getUserEvent(userId: string, eventId: string): Promise<Event> {
    const event = await this.event
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.panels', 'panels')
      .leftJoinAndSelect('event.speakers', 'speakers')
      .andWhere('event.id = :eventId::uuid', { eventId })
      .andWhere('event.userId = :userId', { userId })
      .getOne();

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    return event;
  }

  public async postEvent(userId: string, event: Event): Promise<void> {
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
          image: event.image ? event.image : undefined,
          isActive: event.isActive,
          isPublished: event.isPublished,
          location: event.location,
          marketingPoster: event.marketingPoster ? event.marketingPoster : undefined,
          organizerName: event.organizerName,
          organizerUrl: event.organizerUrl,
          price: event.price,
          purchaseLink: event.purchaseLink,
          startDate: event.startDate,
          subtitle: event.subtitle,
          title: event.title,
          type: event.type,
          userId: event.userId,
          website: event.website,
        })
        .andWhere('id = :id::uuid', { id: event.id })
        .andWhere('userId = :userId', { userId })
        .execute();

      // Delete existing panels and speakers, then insert new ones
      await manager
        .createQueryBuilder()
        .delete()
        .from(Panel)
        .andWhere('event.id = :eventId::uuid', { eventId: event.id })
        .execute();

      await manager
        .createQueryBuilder()
        .delete()
        .from(Speaker)
        .andWhere('event.id = :eventId::uuid', { eventId: event.id })
        .execute();

      // Insert new panels
      if (event.panels && event.panels.length > 0) {
        for (const panel of event.panels) {
          await manager
            .createQueryBuilder()
            .insert()
            .into(Panel)
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
            .into(Speaker)
            .values({
              description: speaker.description,
              event: { id: event.id },
              image: speaker.image,
              name: speaker.name,
              title: speaker.title,
              userId: speaker.userId,
            })
            .execute();
        }
      }
    });
  }

  public async deleteEvent(userId: string, eventId: string): Promise<void> {
    await this.event
      .createQueryBuilder()
      .delete()
      .from(Event)
      .andWhere('id = :eventId::uuid', { eventId })
      .andWhere('userId = :userId', { userId })
      .execute();
  }
}
