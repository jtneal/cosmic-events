import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@cosmic-events/data-access';
import { AboutFeature } from './about-feature';

describe(AboutFeature.name, () => {
  let component: AboutFeature;
  let fixture: ComponentFixture<AboutFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutFeature],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: { getUser: jest.fn() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
