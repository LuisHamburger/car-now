import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsLocation(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isLocation',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          try {
            const lat = value.replace(/ /g, '').split(',')[0];
            const lng = value.replace(/ /g, '').split(',')[1];
            return !isNaN(Number(lat)) && !isNaN(Number(lng));
          } catch (error) {
            return false;
          }
        },
      },
    });
  };
}
