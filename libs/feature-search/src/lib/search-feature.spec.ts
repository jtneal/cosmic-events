import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@cosmic-events/data-access';
import { SearchFeature } from './search-feature';

describe(SearchFeature.name, () => {
  let component: SearchFeature;
  let fixture: ComponentFixture<SearchFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFeature],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
        {
          provide: HttpClient,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: { getUser: jest.fn() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
