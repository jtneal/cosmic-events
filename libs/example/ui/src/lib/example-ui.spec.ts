import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExampleUi } from './example-ui';

describe('ExampleUi', () => {
  let component: ExampleUi;
  let fixture: ComponentFixture<ExampleUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleUi],
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
