export class EventDto {
  public description = '';
  public endDate = new Date();
  public image = '';
  public isActive = false;
  public isPublished = false;
  public location = '';
  public marketingPoster = '';
  public organizer = new EventOrganizer();
  public panels = [] as Panel[];
  public price = 0;
  public purchaseLink = '';
  public speakers = [] as Speaker[];
  public startDate = new Date();
  public title = '';
  public type = EventTypeEnum.Guided_Tours;
  public website = '';
}

export class GuidedTour extends Event {
  public deposit = 0;
  public singleOccupancySupplement = 0;
}

export class Panel {
  public description = '';
  public title = '';
}

export class Speaker {
  public description = '';
  public image = '';
  public name = '';
}

export class EventOrganizer {
  public name = '';
  public url = '';
}

export enum EventTypeEnum {
  Conventions = 'Conventions',
  Cruise_Experiences = 'Cruise Experiences',
  Guided_Tours = 'Guided Tours',
}
