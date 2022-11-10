import { Test, TestingModule } from '@nestjs/testing';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';

describe('DriverController', () => {
  let controller: DriverController;

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

  const mocks = {
    mockDriverService: {
      finishTrip: jest
        .fn()
        .mockReturnValue({ ...trip, status: 'finished', finalLocation }),
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverController],
    })
      .useMocker((mock) => {
        if (mock === DriverService) return mocks.mockDriverService;
      })
      .compile();

    controller = module.get<DriverController>(DriverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should test finishTrip', async () => {
    await expect(
      controller.finishTrip({ driverId: driver.id, finalLocation }),
    ).resolves.toEqual({ ...trip, status: 'finished', finalLocation });
    expect(mocks.mockDriverService.finishTrip).toHaveBeenCalledWith(
      driver.id,
      finalLocation,
    );
  });
});
