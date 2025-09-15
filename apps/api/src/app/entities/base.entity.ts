import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntity {
  @Column()
  public description: string;

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public title: string;

  @Column()
  @Index()
  public userId: string;
}
