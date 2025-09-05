import { Test } from '@nestjs/testing';
import { EventService } from './event.service';

describe('AppService', () => {
  let service: EventService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [EventService],
    }).compile();

    service = app.get<EventService>(EventService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getEvents()).toEqual({ message: 'Hello API' });
    });
  });
});
