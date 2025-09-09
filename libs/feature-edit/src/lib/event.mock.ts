import { EventDto, EventTypeEnum, PanelDto, SpeakerDto } from '@cosmic-events/util-dtos';

// Mock Panel
export const mockPanel = new PanelDto();
mockPanel.description = 'This is my panel description.';
mockPanel.title = 'This is my panel title';

// Mock Speaker
export const mockSpeaker = new SpeakerDto();
mockSpeaker.description = 'This is my speaker description.';
mockSpeaker.image = '';
mockSpeaker.name = 'Speaker Name';

// Mock Event
export const mockEvent = new EventDto();
mockEvent.title = 'This is my event title';
mockEvent.type = EventTypeEnum.GUIDED_TOURS;
mockEvent.location = 'Egypt';
mockEvent.price = 5000;
mockEvent.description = 'This is my event description.';
mockEvent.startDate = new Date('9/14/2025');
mockEvent.endDate = new Date('9/30/2025');
mockEvent.image = '';
mockEvent.marketingPoster = '';
mockEvent.website = 'https://www.cosmicevents.app';
mockEvent.purchaseLink = 'https://www.cosmicevents.app';
mockEvent.isPublished = true;
mockEvent.organizerName = 'Organizer Name';
mockEvent.organizerUrl = 'https://www.cosmicevents.app';
mockEvent.panels = [mockPanel, mockPanel, mockPanel];
mockEvent.speakers = [mockSpeaker, mockSpeaker, mockSpeaker];
