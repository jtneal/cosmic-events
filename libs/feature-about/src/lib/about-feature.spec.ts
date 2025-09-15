import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AboutFeature } from './about-feature';

describe(AboutFeature.name, () => {
  let component: AboutFeature;
  let fixture: ComponentFixture<AboutFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutFeature],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
