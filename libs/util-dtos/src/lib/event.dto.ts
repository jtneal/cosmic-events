import { BadRequestException } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
  IsUUID,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { EventTypeEnum } from './event-type.enum';

export class EventDto {
  @IsNumber()
  @Min(0)
  public clicks = 0;

  public createdAt?: Date;

  @IsOptional()
  public description = '';

  @IsDate()
  @Type(() => Date)
  public endDate = new Date();

  @ValidateIf((x) => x.id !== '')
  @IsUUID()
  public id = '';

  @IsOptional()
  public image = '';

  @IsNumber()
  @Min(0)
  public impressions = 0;

  @IsBoolean()
  public isActive = true;

  @IsBoolean()
  public isPublished = false;

  @IsNotEmpty()
  public location = '';

  @IsOptional()
  public marketingPoster = '';

  @IsNotEmpty()
  public organizerName = '';

  @ValidateIf((x) => x.organizerUrl !== '')
  @IsUrl()
  public organizerUrl = '';

  @IsNumber()
  @Min(0)
  public organizerUrlClicks = 0;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PanelDto)
  public panels = [] as PanelDto[];

  @IsNumber()
  @Min(0)
  @Max(999_999)
  @Type(() => Number)
  public price = 0;

  @ValidateIf((x) => x.purchaseLink !== '')
  @IsUrl()
  public purchaseLink = '';

  @IsNumber()
  @Min(0)
  public purchaseLinkClicks = 0;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpeakerDto)
  public speakers = [] as SpeakerDto[];

  @IsDate()
  @Type(() => Date)
  public startDate = new Date();

  @IsNotEmpty()
  public subtitle = '';

  @IsNotEmpty()
  public title = '';

  @IsEnum(EventTypeEnum)
  public type = EventTypeEnum.GUIDED_TOURS;

  public updatedAt?: Date;

  @IsNumber()
  @Min(0)
  public views = 0;

  @ValidateIf((x) => x.website !== '')
  @IsUrl()
  public website = '';

  @IsNumber()
  @Min(0)
  public websiteClicks = 0;
}

export class PanelDto {
  @IsNotEmpty()
  public description = '';

  @ValidateIf((x) => x.id !== '')
  @IsUUID()
  public id = '';

  @IsNotEmpty()
  public title = '';
}

export class SpeakerDto {
  @IsOptional()
  public description = '';

  @ValidateIf((x) => x.id !== '')
  @IsUUID()
  public id = '';

  @IsOptional()
  public image = '';

  @IsNotEmpty()
  public name = '';

  @IsNotEmpty()
  public title = '';
}

export class EventFormDto {
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const event = JSON.parse(value) as EventDto;

        event.startDate = new Date(event.startDate);
        event.endDate = new Date(event.endDate);

        if (Array.isArray(event.panels)) {
          event.panels = event.panels.map((panel) => Object.assign(new PanelDto(), panel));
        }

        if (Array.isArray(event.speakers)) {
          event.speakers = event.speakers.map((speaker) => Object.assign(new SpeakerDto(), speaker));
        }

        return Object.assign(new EventDto(), event);
      } catch {
        throw new BadRequestException('`data` must be valid JSON');
      }
    }

    return value;
  })
  @ValidateNested()
  @Type(() => EventDto)
  public data!: EventDto;

  @IsOptional()
  public headerImage?: File;

  @IsOptional()
  public marketingPoster?: File;

  @IsOptional()
  public speakerPhotos?: File[];
}
