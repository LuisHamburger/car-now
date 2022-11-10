import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IntegrationService } from '../integration/integration.service';
import { Trip } from './trip.entity';
import { TripService } from './trip.service';

describe('TripService', () => {
  let service: TripService;

  const rider = {
    id: '49093423-d6f1-4f01-99f0-c37afcf21a60',
    email: 'test@test.com',
    paymentMethod: 'CARD',
    idNequiMethod: null,
    idCardMethod: '12093423-d6f1-1f01-99f0-c37afcf21a10',
  };
  const trip = {
    id: '50093423-d6f1-6f01-99f0-c37afcf21a70',
    status: 'in_progress',
    currentLocation: '-74.811432,11.007311',
    finalLocation: '',
    riderId: '49093423-d6f1-4f01-99f0-c37afcf21a60',
    rider,
    driverId: '6bea130f-ec57-46d5-b71d-3562fafd2719',
  };

  const finalLocation = '23.097069089850933,-82.35006433419622';

  const mocks = {
    mockIntegrationService: {
      getAcceptanceToken: jest.fn().mockReturnValue({
        data: {
          data: {
            presigned_acceptance: { acceptance_token: '' },
          },
        },
      }),
      createTransaction: jest
        .fn()
        .mockReturnValue({ ...trip, status: 'finished', finalLocation }),
    },
    mockTripRepository: {
      save: jest.fn().mockImplementation((trip) => trip),
      findOne: jest.fn().mockReturnValue(trip),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripService,
        {
          provide: getRepositoryToken(Trip),
          useValue: mocks.mockTripRepository,
        },
      ],
    })
      .useMocker((mock) => {
        if (mock === IntegrationService) return mocks.mockIntegrationService;
      })
      .compile();

    service = module.get<TripService>(TripService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('should test startTrip method', () => {
    it('start trip', async () => {
      const startTripOptions = {
        currentLocation: '',
        driverId: '',
        riderId: '',
      };
      await expect(service.startTrip(startTripOptions)).resolves.toEqual(
        startTripOptions,
      );

      expect(mocks.mockTripRepository.save).toHaveBeenCalledWith(
        startTripOptions,
      );
    });
  });

  describe('should test finishTrip method', () => {
    it('finish Trip', async () => {
      jest.spyOn(service, 'createTransaction').mockResolvedValueOnce(null);

      await expect(
        service.finishTrip(trip.driverId, finalLocation),
      ).resolves.toEqual({ ...trip, status: 'finished', finalLocation });

      expect(mocks.mockTripRepository.save).toHaveBeenCalledWith({
        ...trip,
        status: 'finished',
        finalLocation,
      });

      expect(mocks.mockTripRepository.findOne).toHaveBeenCalled();
    });

    it('finish Trip - Trip not found', async () => {
      jest
        .spyOn(mocks.mockTripRepository, 'findOne')
        .mockResolvedValueOnce(null);

      await expect(
        service.finishTrip(trip.driverId, finalLocation),
      ).rejects.toThrowError('Trip not found');
    });
  });

  describe('should test createTransaction method', () => {
    it('create transaction', async () => {
      const createTransactionOptions = {
        distanceCost: 1500,
        customerEmail: rider.email,
        paymentType: 'CARD' as 'CARD' | 'NEQUI',
        paymentToken: rider.idCardMethod,
      };
      await expect(
        service.createTransaction(createTransactionOptions),
      ).resolves.toEqual({ ...trip, status: 'finished', finalLocation });

      expect(
        mocks.mockIntegrationService.getAcceptanceToken,
      ).toHaveBeenCalled();

      expect(mocks.mockIntegrationService.createTransaction).toHaveBeenCalled();
    });
  });
});
