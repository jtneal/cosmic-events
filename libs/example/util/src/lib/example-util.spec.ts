import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExampleUtil } from './example-util';

describe('ExampleUtil', () => {
  let component: ExampleUtil;
  let fixture: ComponentFixture<ExampleUtil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleUtil],
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleUtil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
