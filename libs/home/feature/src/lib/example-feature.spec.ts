import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeFeature } from './home-feature';

describe('HomeFeature', () => {
  let component: HomeFeature;
  let fixture: ComponentFixture<HomeFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
