import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactFeature } from './contact-feature';

describe(ContactFeature.name, () => {
  let component: ContactFeature;
  let fixture: ComponentFixture<ContactFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
