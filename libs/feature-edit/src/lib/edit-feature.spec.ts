import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditFeature } from './edit-feature';

describe(EditFeature.name, () => {
  let component: EditFeature;
  let fixture: ComponentFixture<EditFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(EditFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
