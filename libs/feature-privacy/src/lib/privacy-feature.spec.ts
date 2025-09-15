import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivacyFeature } from './privacy-feature';

describe(PrivacyFeature.name, () => {
  let component: PrivacyFeature;
  let fixture: ComponentFixture<PrivacyFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
