import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { IsLocation } from '../../common/isLocation.decorator';

export class RequestRideDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsLocation({
    message:
      "Property currentLocation should be like '123,321', where is lat and lng respectively",
  })
  currentLocation: string;
}
