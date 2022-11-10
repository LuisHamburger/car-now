import { IsString, IsUUID, IsNotEmpty } from 'class-validator';
import { IsLocation } from '../../common/isLocation.decorator';

export class FinishTripDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  driverId: string;

  @IsNotEmpty()
  @IsLocation({
    message:
      "Property finalLocation should be like '123,321', where is lat and lng respectively",
  })
  finalLocation: string;
}
