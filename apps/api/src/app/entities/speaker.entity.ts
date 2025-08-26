import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class Speaker {
  @Column()
  public description: string;

  @ManyToOne(() => Event, (event) => event.speakers)
  public event: Event;

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public image: string;

  @Column()
  public name: string;
}
