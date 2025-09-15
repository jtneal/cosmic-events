import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '@cosmic-events/data-access';
import { ManageFeature } from './manage-feature';

describe(ManageFeature.name, () => {
  let component: ManageFeature;
  let fixture: ComponentFixture<ManageFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageFeature],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
        {
          provide: EventService,
          useValue: { deleteEvent: jest.fn() },
        },
        {
          provide: HttpClient,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
