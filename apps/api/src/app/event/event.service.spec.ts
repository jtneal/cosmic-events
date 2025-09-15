import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { EventService, EventFilters } from './event.service';

describe(EventService.name, () => {
  let service: EventService;
  let eventRepository: jest.Mocked<Repository<Event>>;

  const mockQueryBuilder = {
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getOne: jest.fn(),
    execute: jest.fn(),
    delete: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    into: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
  };

  const mockManager = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const mockRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      find: jest.fn(),
      save: jest.fn(),
      manager: {
        transaction: jest.fn(),
      },
    };

    const app = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = app.get<EventService>(EventService);
    eventRepository = app.get(getRepositoryToken(Event));

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('incrementImpressions', () => {
    it('should increment impressions with basic filters', async () => {
      const filters: EventFilters = {
        endDate: '',
        location: '',
        search: '',
        sort: '',
        startDate: '',
        type: '',
      };

      mockQueryBuilder.execute.mockResolvedValue(undefined);

      await service.incrementImpressions(filters);

      expect(eventRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.update).toHaveBeenCalledWith(Event);
      expect(mockQueryBuilder.set).toHaveBeenCalledWith({ impressions: expect.any(Function) });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('isActive = true');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('isPublished = true');
      expect(mockQueryBuilder.execute).toHaveBeenCalled();
    });

    it('should increment impressions with all filters', async () => {
      const filters: EventFilters = {
        endDate: '2025-12-31',
        location: 'Egypt,Peru',
        search: 'cosmic',
        sort: 'price-asc',
        startDate: '2025-01-01',
        type: 'GUIDED_TOURS',
      };

      mockQueryBuilder.execute.mockResolvedValue(undefined);

      await service.incrementImpressions(filters);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('location IN (:...locations)', { locations: ['Egypt', 'Peru'] });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('type::text IN (:...types)', { types: ['GUIDED_TOURS'] });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('startDate >= :startDate', { startDate: new Date('2025-01-01') });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('endDate <= :endDate', { endDate: new Date('2025-12-31') });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'LOWER(title) LIKE :search OR LOWER(subtitle) LIKE :search OR LOWER(event.description) LIKE :search',
        { search: '%cosmic%' }
      );
    });
  });

  describe('incrementViews', () => {
    it('should increment views for an event', async () => {
      const eventId = 'test-event-id';
      mockQueryBuilder.execute.mockResolvedValue(undefined);

      await service.incrementViews(eventId);

      expect(eventRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.update).toHaveBeenCalledWith(Event);
      expect(mockQueryBuilder.set).toHaveBeenCalledWith({ views: expect.any(Function) });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('event.id = :eventId::uuid', { eventId });
      expect(mockQueryBuilder.execute).toHaveBeenCalled();
    });
  });

  describe('incrementOrganizerUrlClicks', () => {
    it('should increment organizer URL clicks', async () => {
      const eventId = 'test-event-id';
      mockQueryBuilder.execute.mockResolvedValue(undefined);

      await service.incrementOrganizerUrlClicks(eventId);

      expect(mockQueryBuilder.set).toHaveBeenCalledWith({ organizerUrlClicks: expect.any(Function) });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('event.id = :eventId::uuid', { eventId });
    });
  });

  describe('incrementPurchaseLinkClicks', () => {
    it('should increment purchase link clicks', async () => {
      const eventId = 'test-event-id';
      mockQueryBuilder.execute.mockResolvedValue(undefined);

      await service.incrementPurchaseLinkClicks(eventId);

      expect(mockQueryBuilder.set).toHaveBeenCalledWith({ purchaseLinkClicks: expect.any(Function) });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('event.id = :eventId::uuid', { eventId });
    });
  });

  describe('incrementWebsiteClicks', () => {
    it('should increment website clicks', async () => {
      const eventId = 'test-event-id';
      mockQueryBuilder.execute.mockResolvedValue(undefined);

      await service.incrementWebsiteClicks(eventId);

      expect(mockQueryBuilder.set).toHaveBeenCalledWith({ websiteClicks: expect.any(Function) });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('event.id = :eventId::uuid', { eventId });
    });
  });

  describe('incrementEventClicks', () => {
    it('should increment event clicks', async () => {
      const eventId = 'test-event-id';
      mockQueryBuilder.execute.mockResolvedValue(undefined);

      await service.incrementEventClicks(eventId);

      expect(mockQueryBuilder.set).toHaveBeenCalledWith({ clicks: expect.any(Function) });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('event.id = :eventId::uuid', { eventId });
    });
  });

  describe('getEvents', () => {
    it('should return events with basic filters', async () => {
      const filters: EventFilters = {
        endDate: '',
        location: '',
        search: '',
        sort: '',
        startDate: '',
        type: '',
      };
      const mockEvents = [{} as Event];

      mockQueryBuilder.getMany.mockResolvedValue(mockEvents);

      const result = await service.getEvents(filters);

      expect(result).toEqual(mockEvents);
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('event.panels', 'panels');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('event.speakers', 'speakers');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('event.isActive = true');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('event.isPublished = true');
    });

    it('should apply sorting', async () => {
      const filters: EventFilters = {
        endDate: '',
        location: '',
        search: '',
        sort: 'price-asc',
        startDate: '',
        type: '',
      };

      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.getEvents(filters);

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('event.price', 'ASC');
    });

    it('should apply all sorting options', async () => {
      const sortOptions = ['price-desc', 'date-asc', 'date-desc'];
      
      for (const sort of sortOptions) {
        jest.clearAllMocks();
        const filters: EventFilters = {
          endDate: '',
          location: '',
          search: '',
          sort,
          startDate: '',
          type: '',
        };

        mockQueryBuilder.getMany.mockResolvedValue([]);
        await service.getEvents(filters);

        if (sort === 'price-desc') {
          expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('event.price', 'DESC');
        } else if (sort === 'date-asc') {
          expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('event.startDate', 'ASC');
        } else if (sort === 'date-desc') {
          expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('event.startDate', 'DESC');
        }
      }
    });
  });

  describe('getEvent', () => {
    it('should return an event by ID', async () => {
      const eventId = 'test-event-id';
      const mockEvent = { id: eventId } as Event;

      mockQueryBuilder.getOne.mockResolvedValue(mockEvent);

      const result = await service.getEvent(eventId);

      expect(result).toEqual(mockEvent);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('event.id = :eventId::uuid', { eventId });
    });

    it('should throw NotFoundException when event not found', async () => {
      const eventId = 'non-existent-id';

      mockQueryBuilder.getOne.mockResolvedValue(null);

      await expect(service.getEvent(eventId)).rejects.toThrow(NotFoundException);
      await expect(service.getEvent(eventId)).rejects.toThrow(`Event with ID ${eventId} not found`);
    });
  });

  describe('getUserEvents', () => {
    it('should return user events', async () => {
      const userId = 'user-id';
      const mockEvents = [{} as Event];

      eventRepository.find.mockResolvedValue(mockEvents);

      const result = await service.getUserEvents(userId);

      expect(result).toEqual(mockEvents);
      expect(eventRepository.find).toHaveBeenCalledWith({ where: { userId } });
    });
  });

  describe('getUserEvent', () => {
    it('should return a user event by ID', async () => {
      const userId = 'user-id';
      const eventId = 'event-id';
      const mockEvent = { id: eventId, userId } as Event;

      mockQueryBuilder.getOne.mockResolvedValue(mockEvent);

      const result = await service.getUserEvent(userId, eventId);

      expect(result).toEqual(mockEvent);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('event.id = :eventId::uuid', { eventId });
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('event.userId = :userId', { userId });
    });

    it('should throw NotFoundException when user event not found', async () => {
      const userId = 'user-id';
      const eventId = 'non-existent-id';

      mockQueryBuilder.getOne.mockResolvedValue(null);

      await expect(service.getUserEvent(userId, eventId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('postEvent', () => {
    it('should save new event without ID', async () => {
      const userId = 'user-id';
      const event = { title: 'Test Event' } as Event;

      eventRepository.save.mockResolvedValue(event);

      await service.postEvent(userId, event);

      expect(eventRepository.save).toHaveBeenCalledWith(event);
    });

    it('should update existing event with transaction', async () => {
      const userId = 'user-id';
      const event = { 
        id: 'event-id', 
        title: 'Updated Event',
        panels: [{ id: 'panel-1', title: 'Panel 1', description: 'Desc 1', userId }],
        speakers: [{ id: 'speaker-1', name: 'Speaker 1', title: 'Title 1', description: 'Desc 1', image: '', userId }]
      } as Event;

      const mockTransaction = jest.fn().mockImplementation(async (callback) => {
        return await callback(mockManager);
      });

      eventRepository.manager.transaction = mockTransaction;
      mockManager.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.postEvent(userId, event);

      expect(mockTransaction).toHaveBeenCalled();
      expect(mockManager.createQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.update).toHaveBeenCalledWith(Event);
      expect(mockQueryBuilder.delete).toHaveBeenCalled();
      expect(mockQueryBuilder.insert).toHaveBeenCalled();
    });

    it('should handle event without panels and speakers', async () => {
      const userId = 'user-id';
      const event = { 
        id: 'event-id', 
        title: 'Updated Event',
        panels: [],
        speakers: []
      } as Event;

      const mockTransaction = jest.fn().mockImplementation(async (callback) => {
        return await callback(mockManager);
      });

      eventRepository.manager.transaction = mockTransaction;
      mockManager.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.postEvent(userId, event);

      expect(mockTransaction).toHaveBeenCalled();
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event', async () => {
      const userId = 'user-id';
      const eventId = 'event-id';

      mockQueryBuilder.execute.mockResolvedValue(undefined);

      await service.deleteEvent(userId, eventId);

      expect(mockQueryBuilder.delete).toHaveBeenCalled();
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('id = :eventId::uuid', { eventId });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('userId = :userId', { userId });
      expect(mockQueryBuilder.execute).toHaveBeenCalled();
    });
  });
});
