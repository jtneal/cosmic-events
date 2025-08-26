import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Organizer {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;
}
