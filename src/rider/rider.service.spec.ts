import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IntegrationService } from '../integration/integration.service';
import { Rider } from './rider.entity';
import { RiderService } from './rider.service';
import { DriverService } from '../driver/driver.service';
import { TripService } from '../trip/trip.service';

describe('RiderService', () => {
  let service: RiderService;

  const rider = {
    id: '49093423-d6f1-4f01-99f0-c37afcf21a60',
    email: 'test@test.com',
    paymentMethod: 'CARD' as 'NEQUI' | 'CARD',
    idNequiMethod: null,
    idCardMethod: '12093423-d6f1-1f01-99f0-c37afcf21a10',
    trips: null,
  };

  const driver = {
    id: '6bea130f-ec57-46d5-b71d-3562fafd2719',
    status: 'available',
    trips: null,
  };

  const startTripResult = {
    currentLocation: '',
    driverId: '',
    riderId: '',
  };

  const mocks = {
    mockIntegrationService: {
      getAcceptanceToken: jest.fn().mockReturnValue({
        data: {
          data: {
            presigned_acceptance: { acceptance_token: '' },
          },
        },
      }),
      getPaymentMethod: jest.fn().mockImplementationOnce(() => {
        return () => {
          return rider.idCardMethod;
        };
      }),
      postPaymentMethod: jest.fn().mockReturnValue({}),
    },
    mockDriverService: {
      getRandomDriverToDrive: jest.fn().mockReturnValue(driver),
    },
    mockTripService: {
      startTrip: jest.fn().mockReturnValue(startTripResult),
    },
    mockRiderRepository: {
      save: jest.fn().mockImplementation((ride) => ride),
      findOneBy: jest.fn().mockReturnValue(rider),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RiderService,
        {
          provide: getRepositoryToken(Rider),
          useValue: mocks.mockRiderRepository,
        },
      ],
    })
      .useMocker((mock) => {
        if (mock === IntegrationService) return mocks.mockIntegrationService;
        if (mock === DriverService) return mocks.mockDriverService;
        if (mock === TripService) return mocks.mockTripService;
      })
      .compile();

    service = module.get<RiderService>(RiderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('should test createPaymentMethod method', () => {
    it('create payment method', async () => {
      jest
        .spyOn(service, 'validateEmailAndPayMethod')
        .mockResolvedValueOnce(rider);
      await expect(
        service.createPaymentMethod(rider.email, rider.paymentMethod),
      ).resolves.toEqual(rider);

      expect(service.validateEmailAndPayMethod).toHaveBeenCalled();
      expect(
        mocks.mockIntegrationService.getAcceptanceToken,
      ).toHaveBeenCalled();
      expect(mocks.mockIntegrationService.getPaymentMethod).toHaveBeenCalled();
      expect(mocks.mockIntegrationService.postPaymentMethod).toHaveBeenCalled();
      expect(mocks.mockRiderRepository.save).toHaveBeenCalled();
    });

    it('create payment method - throw error creating payment method', async () => {
      jest.spyOn(service, 'validateEmailAndPayMethod').mockRejectedValue(null);
      await expect(
        service.createPaymentMethod(rider.email, rider.paymentMethod),
      ).rejects.toThrowError('Error creating payment method');
    });
  });

  describe('should test validateEmailAndPayMethod method', () => {
    it('validate email and pay method', async () => {
      await expect(
        service.validateEmailAndPayMethod(
          rider.email,
          rider.paymentMethod == 'CARD' ? 'NEQUI' : 'CARD',
        ),
      ).resolves.toEqual(rider);

      expect(mocks.mockRiderRepository.findOneBy).toHaveBeenCalled();
    });

    it('validate email and pay method - throw payment method has already been registered', async () => {
      await expect(
        service.validateEmailAndPayMethod(rider.email, rider.paymentMethod),
      ).rejects.toThrowError('payment method has already been registered');

      expect(mocks.mockRiderRepository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('should test requestRide method', () => {
    it('request a ride', async () => {
      await expect(
        service.requestRide(rider.email, startTripResult.currentLocation),
      ).resolves.toEqual(startTripResult);

      expect(mocks.mockRiderRepository.findOneBy).toHaveBeenCalled();
      expect(mocks.mockTripService.startTrip).toHaveBeenCalled();
    });

    it('request a ride - throw rider with email ${email} not found', async () => {
      jest
        .spyOn(mocks.mockRiderRepository, 'findOneBy')
        .mockResolvedValueOnce(null);
      await expect(
        service.requestRide(rider.email, startTripResult.currentLocation),
      ).rejects.toThrowError(`Rider with email ${rider.email} not found`);

      expect(mocks.mockRiderRepository.findOneBy).toHaveBeenCalled();
    });

    it('request a ride - throw please create a payment method', async () => {
      jest
        .spyOn(mocks.mockRiderRepository, 'findOneBy')
        .mockResolvedValueOnce({});
      await expect(
        service.requestRide(rider.email, startTripResult.currentLocation),
      ).rejects.toThrowError(`Please create a payment method`);

      expect(mocks.mockRiderRepository.findOneBy).toHaveBeenCalled();
    });
  });
});
