import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeUtil } from './home-util';

describe('HomeUtil', () => {
  let component: HomeUtil;
  let fixture: ComponentFixture<HomeUtil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeUtil],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeUtil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
