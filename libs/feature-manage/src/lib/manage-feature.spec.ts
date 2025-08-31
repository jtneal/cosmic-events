import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageFeature } from './manage-feature';

describe(ManageFeature.name, () => {
  let component: ManageFeature;
  let fixture: ComponentFixture<ManageFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
