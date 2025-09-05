import { UserDto } from '@cosmic-events/util-dtos';
import { Body, Controller, Get, Logger, Post, Redirect, Req, Session } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { UserInfo } from './user-info.interface';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name, { timestamp: true });

  public constructor(private readonly config: ConfigService) {}

  @Get('user')
  public getUser(@Session() session: UserDto): UserDto {
    return { email: session.email, name: session.name, picture: session.picture, userId: session.userId };
  }

  @Post('auth')
  @Redirect('/', 302)
  public async handleCredentialResponse(
    @Body('credential') credential: string,
    @Session() session: UserDto
  ): Promise<void> {
    const client = new OAuth2Client();

    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: this.config.get<string>('GOOGLE_CLIENT_ID'),
      });
      const payload = ticket.getPayload() as UserInfo;

      session.email = payload.email;
      session.name = payload.name;
      session.picture = payload.picture;
      session.userId = payload.sub;
    } catch (error) {
      this.logger.error(error?.message, error?.stack);
    }
  }

  @Get('auth/logout')
  @Redirect('/', 302)
  public logout(@Req() req: Request): void {
    req.session.destroy(() => null);
  }
}
