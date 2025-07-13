import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CosmicTitle } from './cosmic-title';

describe(CosmicTitle.name, () => {
  let component: CosmicTitle;
  let fixture: ComponentFixture<CosmicTitle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CosmicTitle],
    }).compileComponents();

    fixture = TestBed.createComponent(CosmicTitle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
