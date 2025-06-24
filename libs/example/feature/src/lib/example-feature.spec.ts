import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExampleFeature } from './example-feature';

describe('ExampleFeature', () => {
  let component: ExampleFeature;
  let fixture: ComponentFixture<ExampleFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
