import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeDataAccess } from './home-data-access';

describe('HomeDataAccess', () => {
  let component: HomeDataAccess;
  let fixture: ComponentFixture<HomeDataAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeDataAccess],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeDataAccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
