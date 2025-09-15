import { Column, CreateDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  public description: string;

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public title: string;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column()
  @Index()
  public userId: string;
}
