import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { EventCard } from './event-card';

describe(EventCard.name, () => {
  let component: EventCard;
  let fixture: ComponentFixture<EventCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCard],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('event', { title: 'Test Event' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
