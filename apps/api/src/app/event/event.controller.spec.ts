import 'reflect-metadata';
import { S3Client } from '@aws-sdk/client-s3';
import { EventDto } from '@cosmic-events/util-dtos';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Event } from '../entities/event.entity';
import { EventController } from './event.controller';
import { EventMapper } from './event.mapper';
import { EventService } from './event.service';

describe(EventController.name, () => {
  let controller: EventController;
  let eventService: jest.Mocked<EventService>;
  let mapper: jest.Mocked<EventMapper>;

  beforeAll(async () => {
    const mockEventService = {
      getEvents: jest.fn(),
      getEvent: jest.fn(),
      getUserEvents: jest.fn(),
      postEvent: jest.fn(),
      deleteEvent: jest.fn(),
      incrementImpressions: jest.fn(),
      incrementViews: jest.fn(),
      incrementOrganizerUrlClicks: jest.fn(),
      incrementPurchaseLinkClicks: jest.fn(),
      incrementWebsiteClicks: jest.fn(),
      incrementEventClicks: jest.fn(),
    };

    const mockMapper = {
      toEvent: jest.fn(),
      toEventDto: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    const mockS3Client = {
      send: jest.fn(),
    };

    const app = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        { provide: EventService, useValue: mockEventService },
        { provide: EventMapper, useValue: mockMapper },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: S3Client, useValue: mockS3Client },
      ],
    }).compile();

    controller = app.get<EventController>(EventController);
    eventService = app.get(EventService);
    mapper = app.get(EventMapper);
  });

  describe('getEvents', () => {
    it('should return mapped events and increment impressions', async () => {
      const mockEvents = [{} as Event, {} as Event];
      const mappedEvents = [{ id: '1' } as EventDto, { id: '2' } as EventDto];
      
      eventService.getEvents.mockResolvedValue(mockEvents);
      eventService.incrementImpressions.mockResolvedValue();
      mapper.toEventDto.mockReturnValueOnce(mappedEvents[0]).mockReturnValueOnce(mappedEvents[1]);

      const result = await controller.getEvents('loc', '2025-01-01', '2025-01-02', 'search', 'type', 'sort');
      
      expect(result).toEqual(mappedEvents);
      expect(eventService.getEvents).toHaveBeenCalledWith({
        endDate: '2025-01-02',
        location: 'loc',
        search: 'search',
        sort: 'sort',
        startDate: '2025-01-01',
        type: 'type'
      });
      expect(eventService.incrementImpressions).toHaveBeenCalled();
    });
  });

  describe('getEvent', () => {
    it('should return mapped event and increment views', async () => {
      const mockEvent = {} as Event;
      const mappedEvent = { id: '1' } as EventDto;
      
      eventService.getEvent.mockResolvedValue(mockEvent);
      eventService.incrementViews.mockResolvedValue();
      mapper.toEventDto.mockReturnValue(mappedEvent);

      const result = await controller.getEvent('1');
      
      expect(result).toEqual(mappedEvent);
      expect(eventService.getEvent).toHaveBeenCalledWith('1');
      expect(eventService.incrementViews).toHaveBeenCalledWith('1');
    });
  });

  describe('getUserEvents', () => {
    it('should return mapped user events', async () => {
      const mockEvents = [{} as Event, {} as Event];
      const mappedEvents = [{ id: '1' } as EventDto, { id: '2' } as EventDto];
      
      eventService.getUserEvents.mockResolvedValue(mockEvents);
      mapper.toEventDto.mockReturnValueOnce(mappedEvents[0]).mockReturnValueOnce(mappedEvents[1]);

      const session = { userId: 'user1', email: '', name: '', picture: '' };
      const result = await controller.getUserEvents(session);
      
      expect(result).toEqual(mappedEvents);
      expect(eventService.getUserEvents).toHaveBeenCalledWith('user1');
    });
  });

  describe('postEvent', () => {
    it('should post event without files', async () => {
      const eventDto = new EventDto();
      eventDto.title = 'Test Event';
      eventDto.subtitle = 'Test';
      eventDto.description = 'Test desc';
      eventDto.startDate = new Date();
      eventDto.endDate = new Date();
      eventDto.location = 'Test location';
      eventDto.price = 100;
      eventDto.organizerName = 'Test Organizer';
      
      const eventForm = { data: eventDto, speakerPhotos: [] };
      const session = { userId: 'user1', email: '', name: '', picture: '' };
      const files = {};
      const mockEvent = {} as Event;
      
      mapper.toEvent.mockReturnValue(mockEvent);
      eventService.postEvent.mockResolvedValue();

      await controller.postEvent(eventForm, files, session);
      
      expect(mapper.toEvent).toHaveBeenCalledWith(eventForm.data, 'user1');
      expect(eventService.postEvent).toHaveBeenCalledWith('user1', mockEvent);
    });
  });

  describe('deleteEvent', () => {
    it('should call deleteEvent with correct params', async () => {
      const session = { userId: 'user1', email: '', name: '', picture: '' };
      
      eventService.deleteEvent.mockResolvedValue();
      
      await controller.deleteEvent('event1', session);
      
      expect(eventService.deleteEvent).toHaveBeenCalledWith('user1', 'event1');
    });
  });

  describe('handleEvent', () => {
    it('should call incrementOrganizerUrlClicks', async () => {
      eventService.incrementOrganizerUrlClicks.mockResolvedValue();
      
      await controller.handleEvent('1', 'organizerUrlClicked');
      
      expect(eventService.incrementOrganizerUrlClicks).toHaveBeenCalledWith('1');
    });

    it('should call incrementPurchaseLinkClicks', async () => {
      eventService.incrementPurchaseLinkClicks.mockResolvedValue();
      
      await controller.handleEvent('1', 'purchaseLinkClicked');
      
      expect(eventService.incrementPurchaseLinkClicks).toHaveBeenCalledWith('1');
    });

    it('should call incrementWebsiteClicks', async () => {
      eventService.incrementWebsiteClicks.mockResolvedValue();
      
      await controller.handleEvent('1', 'websiteClicked');
      
      expect(eventService.incrementWebsiteClicks).toHaveBeenCalledWith('1');
    });

    it('should call incrementEventClicks', async () => {
      eventService.incrementEventClicks.mockResolvedValue();
      
      await controller.handleEvent('1', 'eventClicked');
      
      expect(eventService.incrementEventClicks).toHaveBeenCalledWith('1');
    });

    it('should throw BadRequestException for invalid eventType', async () => {
      try {
        await controller.handleEvent('1', 'invalidType');
        fail('Expected BadRequestException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid event type');
      }
    });
  });
});
