import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export enum EventTypeEnum {
  CONVENTIONS = 'Conventions',
  CRUISE_EXPERIENCES = 'Cruise Experiences',
  GUIDED_TOURS = 'Guided Tours',
}

export class EventDto {
  @IsOptional()
  public description = '';

  @IsDate()
  @Type(() => Date)
  public endDate = new Date();

  @IsNumber()
  @Min(0)
  public id = 0;

  @IsOptional()
  public image = '';

  @IsBoolean()
  public isActive = false;

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpeakerDto)
  public speakers = [] as SpeakerDto[];

  @IsDate()
  @Type(() => Date)
  public startDate = new Date();

  @IsNotEmpty()
  public title = '';

  @IsEnum(EventTypeEnum)
  public type = EventTypeEnum.GUIDED_TOURS;

  @ValidateIf((x) => x.website !== '')
  @IsUrl()
  public website = '';
}

export class PanelDto {
  @IsNotEmpty()
  public description = '';

  @IsNumber()
  @Min(0)
  public id = 0;

  @IsNotEmpty()
  public title = '';
}

export class SpeakerDto {
  @IsOptional()
  public description = '';

  @IsNumber()
  @Min(0)
  public id = 0;

  @IsOptional()
  public image = '';

  @IsNotEmpty()
  public name = '';
}
