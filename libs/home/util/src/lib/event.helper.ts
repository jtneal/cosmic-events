import { EventType } from '@cosmic-events/common-util';

export const eventTypeMap: Record<EventType, string> = {
  event: 'Guided Event',
  conference: 'Conference',
  meeting: 'Meeting',
  cruise: 'Cruise',
  tour: 'Tour',
};

export const getEventTypeLabel = (type: EventType): string => {
  return eventTypeMap[type] || type;
};
