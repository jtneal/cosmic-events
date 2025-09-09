import { EventTypeEnum } from '@cosmic-events/util-dtos';
import { Column, Entity, Index, JoinTable, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Panel } from './panel.entity';
import { Speaker } from './speaker.entity';

@Entity()
export class Event {
  @Column()
  public description: string;

  @Column()
  public endDate: Date;

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public image: string;

  @Column({ default: false })
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

  @OneToMany(() => Panel, (panel) => panel.event, { eager: true, cascade: true })
  public panels: Panel[];

  @Column()
  public price: number;

  @Column()
  public purchaseLink: string;

  @OneToMany(() => Speaker, (speaker) => speaker.event, { eager: true, cascade: true })
  public speakers: Speaker[];

  @Column()
  public startDate: Date;

  @Column()
  public title: string;

  @Column({ enum: EventTypeEnum, type: 'enum' })
  public type: EventTypeEnum;

  @Column()
  @Index()
  public userId: string;

  @Column()
  public website: string;
}
