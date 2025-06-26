import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeroMedia } from './hero-media';

describe(HeroMedia.name, () => {
  let component: HeroMedia;
  let fixture: ComponentFixture<HeroMedia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroMedia],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroMedia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
