import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { DriverSeederService } from './driver/driver.service';

@Injectable()
export class Seeder {
  constructor(
    private readonly driverSeederService: DriverSeederService,
    @InjectEntityManager() private readonly manager: EntityManager,
  ) {}

  async seed(): Promise<void> {
    await this.manager.connection.dropDatabase();
    await this.manager.connection.synchronize();
    await this.driverSeederService.create();
  }
}
