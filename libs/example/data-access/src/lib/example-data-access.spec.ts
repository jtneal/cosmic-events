import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExampleDataAccess } from './example-data-access';

describe('ExampleDataAccess', () => {
  let component: ExampleDataAccess;
  let fixture: ComponentFixture<ExampleDataAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleDataAccess],
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleDataAccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
