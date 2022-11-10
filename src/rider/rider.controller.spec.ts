import { Test, TestingModule } from '@nestjs/testing';
import { RiderController } from './rider.controller';
import { RiderService } from './rider.service';

describe('RiderController', () => {
  let controller: RiderController;

  const rider = {
    id: '49093423-d6f1-4f01-99f0-c37afcf21a60',
    email: 'test@test.com',
    paymentMethod: 'CARD' as 'NEQUI' | 'CARD',
    idNequiMethod: null,
    idCardMethod: '12093423-d6f1-1f01-99f0-c37afcf21a10',
    trips: null,
  };

  const startTripResult = {
    currentLocation: '',
    driverId: '',
    riderId: '',
  };

  const mocks = {
    mockRiderService: {
      createPaymentMethod: jest.fn().mockReturnValue(rider),
      requestRide: jest.fn().mockReturnValue(startTripResult),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RiderController],
    })
      .useMocker((mock) => {
        if (mock === RiderService) return mocks.mockRiderService;
      })
      .compile();

    controller = module.get<RiderController>(RiderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should test createPaymentMethod', async () => {
    await expect(
      controller.createPaymentMethod({
        email: rider.email,
        paymentMethod: rider.paymentMethod,
      }),
    ).resolves.toEqual(rider);
    expect(mocks.mockRiderService.createPaymentMethod).toHaveBeenCalledWith(
      rider.email,
      rider.paymentMethod,
    );
  });

  it('should test requestRide', async () => {
    await expect(
      controller.requestRide({
        email: rider.email,
        currentLocation: startTripResult.currentLocation,
      }),
    ).resolves.toEqual(startTripResult);
    expect(mocks.mockRiderService.requestRide).toHaveBeenCalledWith(
      rider.email,
      startTripResult.currentLocation,
    );
  });
});
