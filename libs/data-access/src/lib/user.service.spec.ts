import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';

describe(UserService.name, () => {
  let service: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: { get: jest.fn() },
        },
      ],
    }).compileComponents();

    service = TestBed.inject(UserService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
