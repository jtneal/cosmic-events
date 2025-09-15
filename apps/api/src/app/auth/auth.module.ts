import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  imports: [ConfigModule],
  providers: [
    {
      provide: OAuth2Client,
      useValue: new OAuth2Client(),
    },
  ],
})
export class AuthModule {}
