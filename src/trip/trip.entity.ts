import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rider } from '../rider/rider.entity';
import { Driver } from '../driver/driver.entity';

@Entity()
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'status',
    enum: ['in_progress', 'finished'],
    default: 'in_progress',
  })
  status: 'in_progress' | 'finished';

  @Column({ name: 'current_location' })
  currentLocation: string;

  @Column({ name: 'final_location', nullable: true })
  finalLocation: string;

  @Column({ name: 'rider_id' })
  riderId: string;

  @ManyToOne(() => Rider, (rider) => rider.trips)
  @JoinColumn({ name: 'rider_id', referencedColumnName: 'id' })
  rider: Rider;

  @Column({ name: 'driver_id' })
  driverId: string;

  @ManyToOne(() => Driver, (driver) => driver.trips)
  @JoinColumn({ name: 'driver_id', referencedColumnName: 'id' })
  driver: Driver;
}
