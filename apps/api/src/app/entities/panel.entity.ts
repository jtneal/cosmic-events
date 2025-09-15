import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Event } from './event.entity';

@Entity()
export class Panel extends BaseEntity {
  @ManyToOne(() => Event, (event) => event.panels, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  public event: Event;
}
