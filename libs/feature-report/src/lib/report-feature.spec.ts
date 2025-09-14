import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportFeature } from './report-feature';

describe(ReportFeature.name, () => {
  let component: ReportFeature;
  let fixture: ComponentFixture<ReportFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
