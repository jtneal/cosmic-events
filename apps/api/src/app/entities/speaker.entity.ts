import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class Speaker {
  @Column()
  public description: string;

  @ManyToOne(() => Event, (event) => event.speakers, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  public event: Event;

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public image: string;

  @Column()
  public name: string;

  @Column()
  public title: string;

  @Column()
  @Index()
  public userId: string;
}
