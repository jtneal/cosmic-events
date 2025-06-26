import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeroContent } from './hero-content';

describe(HeroContent.name, () => {
  let component: HeroContent;
  let fixture: ComponentFixture<HeroContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroContent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
