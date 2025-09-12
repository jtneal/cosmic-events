import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { EventDto, EventFormDto, UserDto } from '@cosmic-events/util-dtos';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  SerializeOptions,
  Session,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { EventMapper } from './event.mapper';
import { EventService } from './event.service';

@Controller()
export class EventController {
  public constructor(
    private readonly config: ConfigService,
    private readonly event: EventService,
    private readonly mapper: EventMapper,
    private readonly s3Client: S3Client,
  ) {}

  @Get('events')
  public async getEvents(
    @Query('location') location: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('search') search: string,
    @Query('type') type: string,
    @Query('sort') sort: string,
  ): Promise<EventDto[]> {
    const events = await this.event.getEvents({ endDate, location, search, sort, startDate, type });

    return events.map((event) => this.mapper.toEventDto(event));
  }

  @Get('events/:eventId')
  public async getEvent(@Param('eventId') eventId: string): Promise<EventDto> {
    return this.mapper.toEventDto(await this.event.getEvent(eventId));
  }

  @Get('user/events')
  public async getUserEvents(@Session() session: UserDto): Promise<EventDto[]> {
    const events = await this.event.getUserEvents(session.userId);

    return events.map((event) => this.mapper.toEventDto(event));
  }

  @Post('events')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'headerImage', maxCount: 1 },
      { name: 'marketingPoster', maxCount: 1 },
      { name: 'speakerPhotos' },
    ]),
  )
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: EventFormDto })
  public async postEvent(
    @Body() eventForm: EventFormDto,
    @UploadedFiles()
    files: {
      headerImage?: Express.Multer.File;
      marketingPoster?: Express.Multer.File;
      speakerPhotos?: Express.Multer.File[];
    },
    @Session() session: UserDto,
  ): Promise<void> {
    if (Array.isArray(files.headerImage) && files.headerImage.length) {
      eventForm.data.image = await this.uploadFileToS3(files.headerImage[0]);
    }

    if (Array.isArray(files.marketingPoster) && files.marketingPoster.length) {
      eventForm.data.marketingPoster = await this.uploadFileToS3(files.marketingPoster[0]);
    }

    if (files.speakerPhotos && files.speakerPhotos.length) {
      for (const photo of files.speakerPhotos) {
        const speaker = eventForm.data.speakers.find((s) => s.image === photo.originalname);

        if (speaker) {
          speaker.image = await this.uploadFileToS3(photo);
        }
      }
    }

    return this.event.postEvent(this.mapper.toEvent(eventForm.data, session.userId));
  }

  @Delete('events/:eventId')
  public deleteEvent(@Param('eventId') eventId: string): Promise<void> {
    return this.event.deleteEvent(eventId);
  }

  private async uploadFileToS3(file: Express.Multer.File): Promise<string> {
    try {
      const filename = `${uuidv4()}.${file.originalname.split('.').pop()}`;
      const params = { Body: file.buffer, Bucket: this.config.get<string>('CDN_BUCKET'), Key: filename };

      await this.s3Client.send(new PutObjectCommand(params));

      return `${this.config.get<string>('CDN_URL')}/${filename}`;
    } catch (error) {
      console.error('Error uploading file:', error);

      return '';
    }
  }
}
