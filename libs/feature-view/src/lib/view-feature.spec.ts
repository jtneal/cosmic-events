import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ViewFeature } from './view-feature';

describe(ViewFeature.name, () => {
  let component: ViewFeature;
  let fixture: ComponentFixture<ViewFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewFeature],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: jest.fn() }) },
        },
        {
          provide: HttpClient,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
