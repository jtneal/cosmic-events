import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';

@Injectable()
export class AppService {
  public constructor(@InjectRepository(Event) private readonly event: Repository<Event>) {}

  public getAll(): Promise<Event[]> {
    return this.event.find();
  }
}
