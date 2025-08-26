import { Column, Entity, JoinColumn, JoinTable, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EventType } from './event-type.enum';
import { Organizer } from './organizer.entity';
import { Panel } from './panel.entity';
import { Speaker } from './speaker.entity';

@Entity()
export class Event {
  @Column()
  public description: string;

  @Column()
  public endDate: Date;

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public image: string;

  @Column()
  public inventory: number;

  @Column({ default: false })
  public isActive: boolean;

  @Column({ default: false })
  public isPublished: boolean;

  @Column()
  public location: string;

  @Column()
  public marketingPoster: string;

  @OneToOne(() => Organizer)
  @JoinColumn()
  public organizer: Organizer;

  @OneToMany(() => Panel, (panel) => panel.event, { eager: true })
  @JoinTable()
  public panels: Panel[];

  @Column()
  public price: number;

  @Column()
  public purchaseLink: string;

  @OneToMany(() => Speaker, (speaker) => speaker.event, { eager: true })
  @JoinTable()
  public speakers: Speaker[];

  @Column()
  public startDate: Date;

  @Column()
  public title: string;

  @Column({ default: EventType.GUIDED_TOURS, enum: EventType, type: 'enum' })
  public type: EventType;

  @Column()
  public website: string;
}
