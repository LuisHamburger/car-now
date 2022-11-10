import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Trip } from '../trip/trip.entity';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'status',
    enum: ['available', 'driving'],
    default: 'available',
  })
  status: 'available' | 'driving';

  @OneToMany(() => Trip, (trip) => trip.rider)
  trips: Trip[];
}
