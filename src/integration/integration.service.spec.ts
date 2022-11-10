import * as rxjs from 'rxjs';

import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationService } from './integration.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

describe('IntegrationService', () => {
  let service: IntegrationService;

  const mocks = {
    mockHttpService: {
      get: jest.fn().mockReturnValue({}),
      post: jest.fn().mockReturnValue({}),
    },
    mockConfigService: {
      get: jest.fn().mockReturnValue(''),
    },
  };

  jest.spyOn(rxjs, 'firstValueFrom').mockResolvedValue('');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntegrationService],
    })
      .useMocker((mock) => {
        if (mock === HttpService) return mocks.mockHttpService;
        if (mock === ConfigService) return mocks.mockConfigService;
      })
      .compile();

    service = module.get<IntegrationService>(IntegrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('should test getAcceptanceToken method', () => {
    it('should get acceptance token', async () => {
      await expect(service.getAcceptanceToken()).resolves.toEqual('');
      expect(mocks.mockHttpService.get).toHaveBeenCalled();
      expect(mocks.mockConfigService.get).toHaveBeenCalledTimes(2);
      expect(rxjs.firstValueFrom).toHaveBeenCalled();
    });
  });

  describe('should test postPaymentMethod method', () => {
    it('should post payment method', async () => {
      await expect(
        service.postPaymentMethod('CARD', 'token', 'token', 'TEST@TEST.COM'),
      ).resolves.toEqual('');
      expect(mocks.mockHttpService.post).toHaveBeenCalled();
      expect(mocks.mockConfigService.get).toHaveBeenCalled();
      expect(rxjs.firstValueFrom).toHaveBeenCalled();
    });
  });

  describe('should test createTransaction method', () => {
    it('should create transaction', async () => {
      await expect(
        service.createTransaction({
          acceptance_token: 'token',
          amount_in_cents: 100,
          currency: 'COP',
          customer_email: 'TEST@TEST.COM',
          payment_method: {
            installments: 1,
            token: 'token',
            type: 'CARD',
          },
          reference: '12345',
        }),
      ).resolves.toEqual('');
      expect(mocks.mockHttpService.post).toHaveBeenCalled();
      expect(mocks.mockConfigService.get).toHaveBeenCalled();
      expect(rxjs.firstValueFrom).toHaveBeenCalled();
    });
  });
});
