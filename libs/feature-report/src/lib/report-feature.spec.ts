import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ReportFeature } from './report-feature';

describe(ReportFeature.name, () => {
  let component: ReportFeature;
  let fixture: ComponentFixture<ReportFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportFeature],
      providers: [
        {
          provide: HttpClient,
          useValue: { request: jest.fn(() => of()) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
