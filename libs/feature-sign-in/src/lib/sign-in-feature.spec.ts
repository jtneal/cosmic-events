import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignInFeature } from './sign-in-feature';

describe(SignInFeature.name, () => {
  let component: SignInFeature;
  let fixture: ComponentFixture<SignInFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
