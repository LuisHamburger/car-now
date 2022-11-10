import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  PreconditionFailedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './driver.entity';
import { TripService } from '../trip/trip.service';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    private readonly tripService: TripService,
  ) {}

  async getRandomDriverToDrive() {
    const driver = await this.driverRepository
      .createQueryBuilder('Driver')
      .select()
      .where('Driver.status = :status', { status: 'available' })
      .orderBy('RANDOM()')
      .getOne();

    if (!driver)
      throw new PreconditionFailedException('Drivers are unavailable');

    await this.driverRepository.update(
      { id: driver.id },
      { status: 'driving' },
    );

    return driver;
  }

  async finishTrip(driverId: string, finalLocation: string) {
    try {
      const response = await this.tripService.finishTrip(
        driverId,
        finalLocation,
      );
      await this.driverRepository.update(
        { id: driverId },
        { status: 'available' },
      );
      return response;
    } catch (error) {
      Logger.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error finishing the trip');
    }
  }
}
