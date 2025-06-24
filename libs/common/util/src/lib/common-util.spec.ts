import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonUtil } from './common-util';

describe('CommonUtil', () => {
  let component: CommonUtil;
  let fixture: ComponentFixture<CommonUtil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonUtil],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonUtil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
