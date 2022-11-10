import { IsNotEmpty, IsEmail, IsEnum } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(
    {
      NEQUI: 'NEQUI',
      CARD: 'CARD',
    },
    { message: 'paymentMethod should be NEQUI or CARD' },
  )
  paymentMethod: 'NEQUI' | 'CARD';
}
