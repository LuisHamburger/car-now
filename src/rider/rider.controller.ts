import { Body, Controller, Post } from '@nestjs/common';
import { RiderService } from './rider.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { RequestRideDto } from './dto/request-ride.dto copy';

@Controller('rider')
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  @Post('/payment_sources')
  async createPaymentMethod(@Body() createPayment: CreatePaymentMethodDto) {
    return await this.riderService.createPaymentMethod(
      createPayment.email,
      createPayment.paymentMethod,
    );
  }

  @Post('/request_a_ride')
  async requestRide(@Body() request: RequestRideDto) {
    return await this.riderService.requestRide(
      request.email,
      request.currentLocation,
    );
  }
}
