import { Body, Controller, Post } from '@nestjs/common';
import { DriverService } from './driver.service';
import { FinishTripDto } from './dto/finish-trip.dto';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post('/finish_ride')
  async finishTrip(@Body() { driverId, finalLocation }: FinishTripDto) {
    return await this.driverService.finishTrip(driverId, finalLocation);
  }
}
