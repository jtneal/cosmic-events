import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Orb } from './orb';

describe(Orb.name, () => {
  let component: Orb;
  let fixture: ComponentFixture<Orb>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Orb],
    }).compileComponents();

    fixture = TestBed.createComponent(Orb);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
