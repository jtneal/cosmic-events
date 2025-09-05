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
}
