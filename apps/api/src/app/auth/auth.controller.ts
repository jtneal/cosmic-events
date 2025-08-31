import { UserDto } from '@cosmic-events/util-dtos';
import { Body, Controller, Get, Post, Redirect, Req, Session } from '@nestjs/common';
import { Request } from 'express';
import { UserInfo } from './user-info.interface';

@Controller('auth')
export class AuthController {
  @Get('user')
  public getUser(@Session() session: UserDto): UserDto {
    return { email: session.email, name: session.name, picture: session.picture, userId: session.userId };
  }

  @Post()
  @Redirect('/', 302)
  public handleCredentialResponse(@Body('credential') credential: string, @Session() session: UserDto): void {
    const responsePayload = this.decodeJWT(credential);

    session.email = responsePayload.email;
    session.name = responsePayload.name;
    session.picture = responsePayload.picture;
    session.userId = responsePayload.sub;
  }

  private decodeJWT(token: string): UserInfo {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  @Get('logout')
  @Redirect('/', 302)
  public logout(@Req() req: Request): void {
    req.session.destroy(() => null);
  }
}
