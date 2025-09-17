import { EventDto } from '@cosmic-events/util-dtos';
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Event } from '../entities/event.entity';
import { HealthController } from './health.controller';

describe(HealthController.name, () => {
  let controller: HealthController;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = app.get<HealthController>(HealthController);
  });

  describe('getHealth', () => {
    it('should return health status', () => {
      expect(controller.getHealth()).toEqual({ status: 'ok' });
    });
  });
});
