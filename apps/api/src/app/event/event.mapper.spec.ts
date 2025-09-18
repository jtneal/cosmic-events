import 'reflect-metadata';
import { EventDto, EventTypeEnum, PanelDto, SpeakerDto } from '@cosmic-events/util-dtos';
import { Event } from '../entities/event.entity';
import { Panel } from '../entities/panel.entity';
import { Speaker } from '../entities/speaker.entity';
import { EventMapper } from './event.mapper';

describe(EventMapper.name, () => {
  let mapper: EventMapper;

  beforeEach(() => {
    mapper = new EventMapper();
  });

  describe('toEvent', () => {
    it('should map EventDto to Event entity with all properties', () => {
      const userId = 'user-123';
      const panelDto: PanelDto = {
        id: 'panel-123',
        title: 'Panel Title',
        description: 'Panel Description',
      };
      const speakerDto: SpeakerDto = {
        id: 'speaker-123',
        name: 'Speaker Name',
        title: 'Speaker Title',
        description: 'Speaker Description',
        image: 'speaker.jpg',
      };
      const dto: EventDto = {
        id: 'event-123',
        title: 'Test Event',
        subtitle: 'Test Subtitle',
        description: 'Test Description',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-02'),
        location: 'Test Location',
        price: 100,
        type: EventTypeEnum.GUIDED_TOURS,
        image: 'event.jpg',
        marketingPoster: 'poster.jpg',
        organizerName: 'Test Organizer',
        organizerUrl: 'https://organizer.com',
        purchaseLink: 'https://purchase.com',
        website: 'https://website.com',
        isActive: true,
        isPublished: true,
        clicks: 10,
        impressions: 100,
        views: 50,
        organizerUrlClicks: 5,
        purchaseLinkClicks: 8,
        websiteClicks: 12,
        panels: [panelDto],
        speakers: [speakerDto],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = mapper.toEvent(dto, userId);

      expect(result).toBeInstanceOf(Event);
      expect(result.id).toBe(dto.id);
      expect(result.title).toBe(dto.title);
      expect(result.subtitle).toBe(dto.subtitle);
      expect(result.description).toBe(dto.description);
      expect(result.startDate).toBe(dto.startDate);
      expect(result.endDate).toBe(dto.endDate);
      expect(result.location).toBe(dto.location);
      expect(result.price).toBe(dto.price);
      expect(result.type).toBe(dto.type);
      expect(result.image).toBe(dto.image);
      expect(result.marketingPoster).toBe(dto.marketingPoster);
      expect(result.organizerName).toBe(dto.organizerName);
      expect(result.organizerUrl).toBe(dto.organizerUrl);
      expect(result.purchaseLink).toBe(dto.purchaseLink);
      expect(result.website).toBe(dto.website);
      expect(result.isActive).toBe(dto.isActive);
      expect(result.isPublished).toBe(dto.isPublished);
      expect(result.clicks).toBe(dto.clicks);
      expect(result.impressions).toBe(dto.impressions);
      expect(result.views).toBe(dto.views);
      expect(result.organizerUrlClicks).toBe(dto.organizerUrlClicks);
      expect(result.purchaseLinkClicks).toBe(dto.purchaseLinkClicks);
      expect(result.websiteClicks).toBe(dto.websiteClicks);
      expect(result.userId).toBe(userId);

      expect(result.panels).toHaveLength(1);
      expect(result.panels[0]).toBeInstanceOf(Panel);
      expect(result.panels[0].id).toBe(panelDto.id);
      expect(result.panels[0].title).toBe(panelDto.title);
      expect(result.panels[0].description).toBe(panelDto.description);
      expect(result.panels[0].userId).toBe(userId);
      expect(result.panels[0].event).toBe(result);

      expect(result.speakers).toHaveLength(1);
      expect(result.speakers[0]).toBeInstanceOf(Speaker);
      expect(result.speakers[0].id).toBe(speakerDto.id);
      expect(result.speakers[0].name).toBe(speakerDto.name);
      expect(result.speakers[0].title).toBe(speakerDto.title);
      expect(result.speakers[0].description).toBe(speakerDto.description);
      expect(result.speakers[0].image).toBe(speakerDto.image);
      expect(result.speakers[0].userId).toBe(userId);
      expect(result.speakers[0].event).toBe(result);
    });

    it('should handle EventDto without ID', () => {
      const dto = new EventDto();
      dto.id = '';
      dto.title = 'Test Event';
      dto.panels = [];
      dto.speakers = [];

      const result = mapper.toEvent(dto, 'user-123');

      expect(result.id).toBeUndefined();
      expect(result.title).toBe('Test Event');
    });

    it('should handle panels without ID', () => {
      const panelDto: PanelDto = {
        id: '',
        title: 'Panel Title',
        description: 'Panel Description',
      };
      const dto = new EventDto();
      dto.panels = [panelDto];
      dto.speakers = [];

      const result = mapper.toEvent(dto, 'user-123');

      expect(result.panels[0].id).toBeUndefined();
      expect(result.panels[0].title).toBe('Panel Title');
    });

    it('should handle speakers without ID', () => {
      const speakerDto: SpeakerDto = {
        id: '',
        name: 'Speaker Name',
        title: 'Speaker Title',
        description: 'Speaker Description',
        image: 'speaker.jpg',
      };
      const dto = new EventDto();
      dto.panels = [];
      dto.speakers = [speakerDto];

      const result = mapper.toEvent(dto, 'user-123');

      expect(result.speakers[0].id).toBeUndefined();
      expect(result.speakers[0].name).toBe('Speaker Name');
    });
  });

  describe('toPanel', () => {
    it('should map PanelDto to Panel entity', () => {
      const dto: PanelDto = {
        id: 'panel-123',
        title: 'Panel Title',
        description: 'Panel Description',
      };

      const result = mapper.toPanel(dto);

      expect(result).toBeInstanceOf(Panel);
      expect(result.id).toBe(dto.id);
      expect(result.title).toBe(dto.title);
      expect(result.description).toBe(dto.description);
    });
  });

  describe('toSpeaker', () => {
    it('should map SpeakerDto to Speaker entity', () => {
      const dto: SpeakerDto = {
        id: 'speaker-123',
        name: 'Speaker Name',
        title: 'Speaker Title',
        description: 'Speaker Description',
        image: 'speaker.jpg',
      };

      const result = mapper.toSpeaker(dto);

      expect(result).toBeInstanceOf(Speaker);
      expect(result.id).toBe(dto.id);
      expect(result.name).toBe(dto.name);
      expect(result.title).toBe(dto.title);
      expect(result.description).toBe(dto.description);
      expect(result.image).toBe(dto.image);
    });
  });

  describe('toEventDto', () => {
    it('should map Event entity to EventDto', () => {
      const panel = new Panel();
      panel.id = 'panel-123';
      panel.title = 'Panel Title';
      panel.description = 'Panel Description';

      const speaker = new Speaker();
      speaker.id = 'speaker-123';
      speaker.name = 'Speaker Name';
      speaker.title = 'Speaker Title';
      speaker.description = 'Speaker Description';
      speaker.image = 'speaker.jpg';

      const event = new Event();
      event.id = 'event-123';
      event.title = 'Test Event';
      event.subtitle = 'Test Subtitle';
      event.description = 'Test Description';
      event.startDate = new Date('2025-01-01');
      event.endDate = new Date('2025-01-02');
      event.location = 'Test Location';
      event.price = 100;
      event.type = EventTypeEnum.GUIDED_TOURS;
      event.image = 'event.jpg';
      event.marketingPoster = 'poster.jpg';
      event.organizerName = 'Test Organizer';
      event.organizerUrl = 'https://organizer.com';
      event.purchaseLink = 'https://purchase.com';
      event.website = 'https://website.com';
      event.isActive = true;
      event.isPublished = true;
      event.clicks = 10;
      event.impressions = 100;
      event.views = 50;
      event.organizerUrlClicks = 5;
      event.purchaseLinkClicks = 8;
      event.websiteClicks = 12;
      event.panels = [panel];
      event.speakers = [speaker];
      event.createdAt = new Date('2025-01-01T00:00:00Z');
      event.updatedAt = new Date('2025-01-02T00:00:00Z');

      const result = mapper.toEventDto(event);

      expect(result).toBeInstanceOf(EventDto);
      expect(result.id).toBe(event.id);
      expect(result.title).toBe(event.title);
      expect(result.subtitle).toBe(event.subtitle);
      expect(result.description).toBe(event.description);
      expect(result.startDate).toBe(event.startDate);
      expect(result.endDate).toBe(event.endDate);
      expect(result.location).toBe(event.location);
      expect(result.price).toBe(event.price);
      expect(result.type).toBe(event.type);
      expect(result.image).toBe(event.image);
      expect(result.marketingPoster).toBe(event.marketingPoster);
      expect(result.organizerName).toBe(event.organizerName);
      expect(result.organizerUrl).toBe(event.organizerUrl);
      expect(result.purchaseLink).toBe(event.purchaseLink);
      expect(result.website).toBe(event.website);
      expect(result.isActive).toBe(event.isActive);
      expect(result.isPublished).toBe(event.isPublished);
      expect(result.clicks).toBe(event.clicks);
      expect(result.impressions).toBe(event.impressions);
      expect(result.views).toBe(event.views);
      expect(result.organizerUrlClicks).toBe(event.organizerUrlClicks);
      expect(result.purchaseLinkClicks).toBe(event.purchaseLinkClicks);
      expect(result.websiteClicks).toBe(event.websiteClicks);
      expect(result.createdAt).toBe(event.createdAt);
      expect(result.updatedAt).toBe(event.updatedAt);

      expect(result.panels).toHaveLength(1);
      expect(result.panels[0]).toBeInstanceOf(PanelDto);
      expect(result.panels[0].id).toBe(panel.id);
      expect(result.panels[0].title).toBe(panel.title);
      expect(result.panels[0].description).toBe(panel.description);

      expect(result.speakers).toHaveLength(1);
      expect(result.speakers[0]).toBeInstanceOf(SpeakerDto);
      expect(result.speakers[0].id).toBe(speaker.id);
      expect(result.speakers[0].name).toBe(speaker.name);
      expect(result.speakers[0].title).toBe(speaker.title);
      expect(result.speakers[0].description).toBe(speaker.description);
      expect(result.speakers[0].image).toBe(speaker.image);
    });
  });

  describe('toPanelDto', () => {
    it('should map Panel entity to PanelDto', () => {
      const panel = new Panel();
      panel.id = 'panel-123';
      panel.title = 'Panel Title';
      panel.description = 'Panel Description';

      const result = mapper.toPanelDto(panel);

      expect(result).toBeInstanceOf(PanelDto);
      expect(result.id).toBe(panel.id);
      expect(result.title).toBe(panel.title);
      expect(result.description).toBe(panel.description);
    });
  });

  describe('toSpeakerDto', () => {
    it('should map Speaker entity to SpeakerDto', () => {
      const speaker = new Speaker();
      speaker.id = 'speaker-123';
      speaker.name = 'Speaker Name';
      speaker.title = 'Speaker Title';
      speaker.description = 'Speaker Description';
      speaker.image = 'speaker.jpg';

      const result = mapper.toSpeakerDto(speaker);

      expect(result).toBeInstanceOf(SpeakerDto);
      expect(result.id).toBe(speaker.id);
      expect(result.name).toBe(speaker.name);
      expect(result.title).toBe(speaker.title);
      expect(result.description).toBe(speaker.description);
      expect(result.image).toBe(speaker.image);
    });
  });
});