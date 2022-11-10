import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RiderModule } from './rider/rider.module';
import { TripModule } from './trip/trip.module';
import { DriverModule } from './driver/driver.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RiderModule,
    TripModule,
    DriverModule,
  ],
})
export class AppModule {}
