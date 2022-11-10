import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Trip } from '../trip/trip.entity';

@Entity()
export class Rider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'payment_method', enum: ['NEQUI', 'CARD'] })
  paymentMethod: 'NEQUI' | 'CARD';

  @Column({ name: 'id_nequi_method', nullable: true })
  idNequiMethod?: string;

  @Column({ name: 'id_card_method', nullable: true })
  idCardMethod?: string;

  @OneToMany(() => Trip, (trip) => trip.rider)
  trips: Trip[];
}
