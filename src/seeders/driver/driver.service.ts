import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from '../../driver/driver.entity';

@Injectable()
export class DriverSeederService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepo: Repository<Driver>,
  ) {}

  async create() {
    await this.driverRepo.save([{}, {}, {}, {}, {}]);
  }
}
