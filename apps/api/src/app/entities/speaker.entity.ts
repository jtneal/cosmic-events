import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Event } from './event.entity';

@Entity()
export class Speaker extends BaseEntity {
  @ManyToOne(() => Event, (event) => event.speakers, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  public event: Event;

  @Column()
  public image: string;

  @Column()
  public name: string;
}
