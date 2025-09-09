import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewFeature } from './view-feature';

describe(ViewFeature.name, () => {
  let component: ViewFeature;
  let fixture: ComponentFixture<ViewFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
