import { EventDto, PanelDto, SpeakerDto } from '@cosmic-events/util-dtos';
import { Injectable } from '@nestjs/common';
import { Event } from '../entities/event.entity';
import { Panel } from '../entities/panel.entity';
import { Speaker } from '../entities/speaker.entity';

@Injectable()
export class EventMapper {
  public toEvent(dto: EventDto, userId: string): Event {
    const event = new Event();

    event.clicks = dto.clicks;
    event.description = dto.description;
    event.description = dto.description;
    event.endDate = dto.endDate;
    event.image = dto.image;
    event.impressions = dto.impressions;
    event.isActive = dto.isActive;
    event.isPublished = dto.isPublished;
    event.location = dto.location;
    event.marketingPoster = dto.marketingPoster;
    event.organizerName = dto.organizerName;
    event.organizerUrl = dto.organizerUrl;
    event.organizerUrlClicks = dto.organizerUrlClicks;
    event.panels = dto.panels.map((panelDto) => {
      const panel = new Panel();

      panel.description = panelDto.description;
      panel.event = event;
      panel.title = panelDto.title;
      panel.userId = userId;

      if (panelDto.id !== '') {
        panel.id = panelDto.id;
      }

      return panel;
    });
    event.price = dto.price;
    event.purchaseLink = dto.purchaseLink;
    event.purchaseLinkClicks = dto.purchaseLinkClicks;
    event.speakers = dto.speakers.map((speakerDto) => {
      const speaker = new Speaker();

      speaker.description = speakerDto.description;
      speaker.event = event;
      speaker.image = speakerDto.image;
      speaker.name = speakerDto.name;
      speaker.title = speakerDto.title;
      speaker.userId = userId;

      if (speakerDto.id !== '') {
        speaker.id = speakerDto.id;
      }

      return speaker;
    });
    event.startDate = dto.startDate;
    event.subtitle = dto.subtitle;
    event.title = dto.title;
    event.type = dto.type;
    event.userId = userId;
    event.views = dto.views;
    event.website = dto.website;
    event.websiteClicks = dto.websiteClicks;

    if (dto.id !== '') {
      event.id = dto.id;
    }

    return event;
  }

  public toPanel(dto: PanelDto): Panel {
    const panel = new Panel();

    panel.description = dto.description;
    panel.id = dto.id;
    panel.title = dto.title;

    return panel;
  }

  public toSpeaker(dto: SpeakerDto): Speaker {
    const speaker = new Speaker();

    speaker.description = dto.description;
    speaker.id = dto.id;
    speaker.image = dto.image;
    speaker.name = dto.name;
    speaker.title = dto.title;

    return speaker;
  }

  public toEventDto(event: Event): EventDto {
    const dto = new EventDto();

    dto.clicks = event.clicks;
    dto.createdAt = event.createdAt;
    dto.description = event.description;
    dto.endDate = event.endDate;
    dto.id = event.id;
    dto.image = event.image;
    dto.impressions = event.impressions;
    dto.isActive = event.isActive;
    dto.isPublished = event.isPublished;
    dto.location = event.location;
    dto.marketingPoster = event.marketingPoster;
    dto.organizerName = event.organizerName;
    dto.organizerUrl = event.organizerUrl;
    dto.organizerUrlClicks = event.organizerUrlClicks;
    dto.panels = event.panels.map((panel) => this.toPanelDto(panel));
    dto.price = event.price;
    dto.purchaseLink = event.purchaseLink;
    dto.purchaseLinkClicks = event.purchaseLinkClicks;
    dto.speakers = event.speakers.map((speaker) => this.toSpeakerDto(speaker));
    dto.startDate = event.startDate;
    dto.subtitle = event.subtitle;
    dto.title = event.title;
    dto.type = event.type;
    dto.updatedAt = event.updatedAt;
    dto.views = event.views;
    dto.website = event.website;
    dto.websiteClicks = event.websiteClicks;

    return dto;
  }

  public toPanelDto(panel: Panel): PanelDto {
    const dto = new PanelDto();

    dto.description = panel.description;
    dto.id = panel.id;
    dto.title = panel.title;

    return dto;
  }

  public toSpeakerDto(speaker: Speaker): SpeakerDto {
    const dto = new SpeakerDto();

    dto.description = speaker.description;
    dto.id = speaker.id;
    dto.image = speaker.image;
    dto.name = speaker.name;
    dto.title = speaker.title;

    return dto;
  }
}
