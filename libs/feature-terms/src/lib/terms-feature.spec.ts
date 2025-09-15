import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TermsFeature } from './terms-feature';

describe(TermsFeature.name, () => {
  let component: TermsFeature;
  let fixture: ComponentFixture<TermsFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(TermsFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
