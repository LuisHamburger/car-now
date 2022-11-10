import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Merchants } from '../common/merchants.interface';
import { PaymentCreation } from '../common/payment-creation.interface';
import { CardMethod } from '../common/token-card.interface';
import { NequiMethod } from '../common/token-nequi.interface';
import { Transaction } from '../common/create-transaction';

@Injectable()
export class IntegrationService {
  private readonly paymentMethod = {
    CARD: async () => {
      const { data: response } = await firstValueFrom(
        this.httpService.post<CardMethod>(
          `${this.configService.get('WOMPI_API')}/tokens/cards`,
          {
            number: '4242424242424242',
            cvc: '789',
            exp_month: '12',
            exp_year: '29',
            card_holder: 'Pedro Pérez',
          },
          {
            headers: {
              Authorization: `Bearer ${this.configService.get('PUBLIC_KEY')}`,
            },
          },
        ),
      );
      return response.data.id;
    },

    NEQUI: async () => {
      const { data: response } = await firstValueFrom(
        this.httpService.post<NequiMethod>(
          `${this.configService.get('WOMPI_API')}/tokens/nequi`,
          {
            phone_number: 3005058144,
          },
          {
            headers: {
              Authorization: `Bearer ${this.configService.get('PUBLIC_KEY')}`,
            },
          },
        ),
      );
      return response.data.id;
    },
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  getPaymentMethod(paymentMethod: 'NEQUI' | 'CARD') {
    return this.paymentMethod[paymentMethod];
  }

  async getAcceptanceToken() {
    return await firstValueFrom(
      this.httpService.get<Merchants>(
        `${this.configService.get(
          'WOMPI_API',
        )}/merchants/${this.configService.get('PUBLIC_KEY')}`,
      ),
    );
  }

  async postPaymentMethod(
    paymentMethod: 'NEQUI' | 'CARD',
    token: string,
    acceptanceToken: string,
    email: string,
  ) {
    return await firstValueFrom(
      this.httpService.post<PaymentCreation>(
        `${this.configService.get('WOMPI_API')}/payment_sources`,
        {
          type: paymentMethod,
          token,
          acceptance_token: acceptanceToken,
          customer_email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${this.configService.get('PRIVATE_KEY')}`,
          },
        },
      ),
    );
  }

  async createTransaction({
    acceptance_token,
    amount_in_cents,
    currency,
    customer_email,
    payment_method,
  }: Transaction) {
    return await firstValueFrom(
      this.httpService.post(
        `${this.configService.get('WOMPI_API')}/transactions`,
        {
          acceptance_token,
          amount_in_cents,
          currency,
          customer_email,
          payment_method,
          reference: uuidv4(),
        },
        {
          headers: {
            Authorization: `Bearer ${this.configService.get('PRIVATE_KEY')}`,
          },
        },
      ),
    );
  }
}
