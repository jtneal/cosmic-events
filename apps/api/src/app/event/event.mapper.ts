import { EventDto, PanelDto, SpeakerDto } from '@cosmic-events/util-dtos';
import { Injectable } from '@nestjs/common';
import { Event } from '../entities/event.entity';
import { Panel } from '../entities/panel.entity';
import { Speaker } from '../entities/speaker.entity';

@Injectable()
export class EventMapper {
  public toEvent(dto: EventDto, panels: Panel[], speakers: Speaker[]): Event {
    const event = new Event();

    event.description = dto.description;
    event.endDate = dto.endDate;
    event.id = dto.id;
    event.image = dto.image;
    event.isActive = dto.isActive;
    event.isPublished = dto.isPublished;
    event.location = dto.location;
    event.marketingPoster = dto.marketingPoster;
    event.organizerName = dto.organizerName;
    event.organizerUrl = dto.organizerUrl;
    event.panels = panels;
    event.price = dto.price;
    event.purchaseLink = dto.purchaseLink;
    event.speakers = speakers;
    event.startDate = dto.startDate;
    event.title = dto.title;
    event.type = dto.type;
    event.website = dto.website;

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

    return speaker;
  }

  public toEventDto(event: Event): EventDto {
    const dto = new EventDto();

    dto.description = event.description;
    dto.endDate = event.endDate;
    dto.id = event.id;
    dto.image = event.image;
    dto.isActive = event.isActive;
    dto.isPublished = event.isPublished;
    dto.location = event.location;
    dto.marketingPoster = event.marketingPoster;
    dto.organizerName = event.organizerName;
    dto.organizerUrl = event.organizerUrl;
    dto.panels = event.panels.map((panel) => this.toPanelDto(panel));
    dto.price = event.price;
    dto.purchaseLink = event.purchaseLink;
    dto.speakers = event.speakers.map((speaker) => this.toSpeakerDto(speaker));
    dto.startDate = event.startDate;
    dto.title = event.title;
    dto.type = event.type;
    dto.website = event.website;

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

    return dto;
  }
}
