import { Repository } from 'typeorm';

import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rider } from './rider.entity';
import { DriverService } from '../driver/driver.service';
import { TripService } from '../trip/trip.service';
import { IntegrationService } from '../integration/integration.service';

@Injectable()
export class RiderService {
  constructor(
    @InjectRepository(Rider)
    private readonly riderRepository: Repository<Rider>,
    private readonly integrationService: IntegrationService,
    private readonly driverService: DriverService,
    private readonly tripService: TripService,
  ) {}

  async createPaymentMethod(email: string, paymentMethod: 'NEQUI' | 'CARD') {
    try {
      const rider = await this.validateEmailAndPayMethod(email, paymentMethod);
      const { data: response } =
        await this.integrationService.getAcceptanceToken();
      const acceptanceToken: string =
        response.data.presigned_acceptance.acceptance_token;

      const getToken = this.integrationService.getPaymentMethod(paymentMethod);
      const token = await getToken();

      await this.integrationService.postPaymentMethod(
        paymentMethod,
        token,
        acceptanceToken,
        email,
      );

      return await this.riderRepository.save({
        ...rider,
        paymentMethod,
        email,
        idCardMethod: paymentMethod == 'CARD' ? token : null,
        idNequiMethod: paymentMethod == 'NEQUI' ? token : null,
      });
    } catch (error) {
      Logger.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error creating payment method');
    }
  }

  async validateEmailAndPayMethod(
    email: string,
    paymentMethod: 'NEQUI' | 'CARD',
  ) {
    const rider = await this.riderRepository.findOneBy({ email });

    if (
      rider &&
      ((paymentMethod == 'CARD' && rider.idCardMethod) ||
        (paymentMethod == 'NEQUI' && rider.idNequiMethod))
    ) {
      throw new ConflictException('payment method has already been registered');
    }
    return rider;
  }

  async requestRide(email: string, currentLocation: string) {
    try {
      const rider = await this.riderRepository.findOneBy({ email });
      if (!rider)
        throw new BadRequestException(`Rider with email ${email} not found`);

      if (!rider.paymentMethod)
        throw new BadRequestException(`Please create a payment method`);

      const driver = await this.driverService.getRandomDriverToDrive();

      return await this.tripService.startTrip({
        riderId: rider.id,
        driverId: driver.id,
        currentLocation,
      });
    } catch (error) {
      Logger.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error requesting a ride');
    }
  }
}
