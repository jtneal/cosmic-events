import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '@cosmic-events/data-access';
import { of } from 'rxjs';
import { EditFeature } from './edit-feature';

describe(EditFeature.name, () => {
  let component: EditFeature;
  let fixture: ComponentFixture<EditFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFeature],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: jest.fn() }) },
        },
        {
          provide: EventService,
          useValue: { getEvent: jest.fn(), postEvent: jest.fn() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
