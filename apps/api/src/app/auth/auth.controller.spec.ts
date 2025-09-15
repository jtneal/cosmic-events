
import { UserDto } from '@cosmic-events/util-dtos';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Request } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { AuthController } from './auth.controller';

describe(AuthController.name, () => {
  const verifyIdToken = jest.fn();
  let controller: AuthController;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
        {
          provide: OAuth2Client,
          useValue: { verifyIdToken },
        },
      ],
    }).compile();

    controller = app.get<AuthController>(AuthController);
  });

  describe('getUser', () => {
    it('should return user session info', () => {
      const session: UserDto = {
        email: 'test@example.com',
        name: 'Test User',
        picture: 'pic.jpg',
        userId: '123',
      };

      expect(controller.getUser(session)).toEqual(session);
    });
  });

  describe('handleCredentialResponse', () => {
    it('should set session from Google payload', async () => {
      const credential = 'fake-credential';
      const session: UserDto = new UserDto();
      const payload = {
        email: 'user@site.com',
        name: 'User Name',
        picture: 'pic.png',
        sub: 'google-id',
      };

      verifyIdToken.mockResolvedValue({ getPayload: () => payload });
      await controller.handleCredentialResponse(credential, session);

      expect(session.email).toBe(payload.email);
      expect(session.name).toBe(payload.name);
      expect(session.picture).toBe(payload.picture);
      expect(session.userId).toBe(payload.sub);
      expect(verifyIdToken).toHaveBeenCalledWith({ idToken: credential });
    });

    it('should log error if Google verification fails', async () => {
      const credential = 'bad-credential';
      const session: UserDto = new UserDto();
      const error = new Error('Invalid token');
      const loggerError = jest.spyOn(controller['logger'], 'error').mockImplementation();

      verifyIdToken.mockRejectedValue(error);
      await controller.handleCredentialResponse(credential, session);

      expect(loggerError).toHaveBeenCalledWith(error.message, error.stack);
    });
  });

  describe('logout', () => {
    it('should destroy session', () => {
      const destroy = jest.fn((cb) => cb());
      const req = { session: { destroy } } as unknown as Request;

      controller.logout(req);

      expect(destroy).toHaveBeenCalled();
    });
  });
});
