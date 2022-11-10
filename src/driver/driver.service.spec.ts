import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TripService } from '../trip/trip.service';
import { DriverService } from './driver.service';
import { Driver } from './driver.entity';

describe('DriverService', () => {
  let service: DriverService;

  const driver = {
    id: '6bea130f-ec57-46d5-b71d-3562fafd2719',
    status: 'available',
    trips: null,
  };

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

  const select = jest.fn().mockReturnThis();
  const where = jest.fn().mockReturnThis();
  const orderBy = jest.fn().mockReturnThis();
  const getOne = jest.fn().mockReturnValue(driver);

  const mocks = {
    mockTripService: {
      finishTrip: jest
        .fn()
        .mockReturnValue({ ...trip, status: 'finished', finalLocation }),
    },
    mockDriverRepository: {
      update: jest.fn().mockReturnValue(driver),
      createQueryBuilder: jest.fn().mockImplementation(() => {
        return {
          select,
          orderBy,
          where,
          getOne,
        };
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriverService,
        {
          provide: getRepositoryToken(Driver),
          useValue: mocks.mockDriverRepository,
        },
      ],
    })
      .useMocker((mock) => {
        if (mock === TripService) return mocks.mockTripService;
      })
      .compile();

    service = module.get<DriverService>(DriverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('should test getRandomDriverToDrive method', () => {
    it('should get random driver to drive', async () => {
      await expect(service.getRandomDriverToDrive()).resolves.toEqual(driver);
      expect(mocks.mockDriverRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mocks.mockDriverRepository.update).toHaveBeenCalled();
    });

    it('should throw an error getting random driver to drive', async () => {
      jest
        .spyOn(mocks.mockDriverRepository.createQueryBuilder(), 'getOne')
        .mockReturnValueOnce(null);
      await expect(service.getRandomDriverToDrive()).rejects.toThrowError(
        'Drivers are unavailable',
      );
    });
  });

  describe('should test finishTrip method', () => {
    it('should finish the trip', async () => {
      await expect(
        service.finishTrip(driver.id, finalLocation),
      ).resolves.toEqual({ ...trip, status: 'finished', finalLocation });
      expect(mocks.mockTripService.finishTrip).toHaveBeenCalledWith(
        driver.id,
        finalLocation,
      );
      expect(mocks.mockDriverRepository.update).toHaveBeenCalled();
    });

    it('should throw an error finishing the trip', async () => {
      jest
        .spyOn(mocks.mockTripService, 'finishTrip')
        .mockRejectedValueOnce(null);
      await expect(
        service.finishTrip(driver.id, finalLocation),
      ).rejects.toThrowError('Error finishing the trip');
    });
  });
});
