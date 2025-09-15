import { EventTypeEnum } from '@cosmic-events/util-dtos';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Panel } from './panel.entity';
import { Speaker } from './speaker.entity';

@Entity()
export class Event extends BaseEntity {
  @Column()
  public clicks: number;

  @Column()
  public endDate: Date;

  @Column()
  public image: string;

  @Column()
  public impressions: number;

  @Column({ default: true })
  public isActive: boolean;

  @Column({ default: false })
  public isPublished: boolean;

  @Column()
  public location: string;

  @Column()
  public marketingPoster: string;

  @Column()
  public organizerName: string;

  @Column()
  public organizerUrl: string;

  @Column()
  public organizerUrlClicks: number;

  @OneToMany(() => Panel, (panel) => panel.event, { eager: true, cascade: true })
  public panels: Panel[];

  @Column()
  public price: number;

  @Column()
  public purchaseLink: string;

  @Column()
  public purchaseLinkClicks: number;

  @OneToMany(() => Speaker, (speaker) => speaker.event, { eager: true, cascade: true })
  public speakers: Speaker[];

  @Column()
  public startDate: Date;

  @Column()
  public subtitle: string;

  @Column({ enum: EventTypeEnum, type: 'enum' })
  public type: EventTypeEnum;

  @Column()
  public views: number;

  @Column()
  public website: string;

  @Column()
  public websiteClicks: number;
}
