import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class Panel {
  @Column()
  public description: string;

  @ManyToOne(() => Event, (event) => event.panels)
  public event: Event;

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;
}
