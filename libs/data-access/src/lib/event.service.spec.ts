import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EventService } from './event.service';

describe(EventService.name, () => {
  let service: EventService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
        },
      ],
    }).compileComponents();

    service = TestBed.inject(EventService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
