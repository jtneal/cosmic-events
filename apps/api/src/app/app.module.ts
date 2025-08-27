import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Event } from './entities/event.entity';
import { Organizer } from './entities/organizer.entity';
import { Panel } from './entities/panel.entity';
import { Speaker } from './entities/speaker.entity';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Event]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        database: config.get<string>('DATABASE_NAME'),
        entities: [Event, Organizer, Panel, Speaker],
        region: config.get<string>('DATABASE_REGION'),
        resourceArn: config.get<string>('DATABASE_RESOURCE_ARN'),
        secretArn: config.get<string>('DATABASE_SECRET_ARN'),
        // synchronize: true,
        type: 'aurora-postgres',
      }),
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
