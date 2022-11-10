import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from './trip.entity';
import { IntegrationService } from '../integration/integration.service';

interface StartTripOptions {
  riderId: string;
  driverId: string;
  currentLocation: string;
}

interface CreateTransactionOptions {
  distanceCost: number;
  customerEmail: string;
  paymentType: 'NEQUI' | 'CARD';
  paymentToken: string;
}
@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    private readonly integrationService: IntegrationService,
  ) {}

  async startTrip({ riderId, driverId, currentLocation }: StartTripOptions) {
    return await this.tripRepository.save({
      riderId,
      driverId,
      currentLocation,
    });
  }

  async finishTrip(driverId: string, finalLocation: string) {
    const trip = await this.tripRepository.findOne({
      where: {
        driverId,
        status: 'in_progress',
      },
      relations: {
        rider: true,
      },
    });
    if (!trip) throw new BadRequestException('Trip not found');

    const distanceCost = calculateDistanceAndCost(
      trip.currentLocation,
      finalLocation,
    );

    const token =
      trip.rider.paymentMethod === 'CARD'
        ? trip.rider.idCardMethod
        : trip.rider.idNequiMethod;

    await this.createTransaction({
      distanceCost,
      customerEmail: trip.rider.email,
      paymentType: trip.rider.paymentMethod,
      paymentToken: token,
    });

    return await this.tripRepository.save({
      ...trip,
      status: 'finished',
      finalLocation,
    });
  }

  async createTransaction({
    distanceCost,
    customerEmail,
    paymentType,
    paymentToken,
  }: CreateTransactionOptions) {
    const { data: response } =
      await this.integrationService.getAcceptanceToken();
    const acceptanceToken: string =
      response.data.presigned_acceptance.acceptance_token;
    const amountInCents = Math.floor((distanceCost + 3500) * 100);
    const currency = 'COP';
    const paymentMethod = {
      type: paymentType,
      token: paymentToken,
      installments: 1,
      phone_number: 3000000000,
    };

    return await this.integrationService.createTransaction({
      acceptance_token: acceptanceToken,
      amount_in_cents: amountInCents,
      currency,
      customer_email: customerEmail,
      payment_method: paymentMethod,
    });
  }
}

const calculateDistanceBetweenTwoCoordinates = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  lat1 = degreesARadians(lat1);
  lon1 = degreesARadians(lon1);
  lat2 = degreesARadians(lat2);
  lon2 = degreesARadians(lon2);
  const EARTH_RADIO_IN_KILOMETERS = 6371;
  const differenceBetweenLengths = lon2 - lon1;
  const differenceBetweenLatitudes = lat2 - lat1;
  const calculate1 =
    Math.pow(Math.sin(differenceBetweenLatitudes / 2.0), 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.pow(Math.sin(differenceBetweenLengths / 2.0), 2);
  const calculate2 =
    2 * Math.atan2(Math.sqrt(calculate1), Math.sqrt(1 - calculate1));
  return EARTH_RADIO_IN_KILOMETERS * calculate2;
};

const degreesARadians = (degrees: number) => {
  return (degrees * Math.PI) / 180;
};

const calculateDistanceAndCost = (
  currentLocation: string,
  finalLocation: string,
) => {
  const initialLat = Number(currentLocation.split(',')[0]);
  const initialLong = Number(currentLocation.split(',')[1]);
  const finalLat = Number(finalLocation.split(',')[0]);
  const finalLong = Number(finalLocation.split(',')[1]);

  const distance = calculateDistanceBetweenTwoCoordinates(
    initialLat,
    initialLong,
    finalLat,
    finalLong,
  );
  return 1000 * distance;
};
