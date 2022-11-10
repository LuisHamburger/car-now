import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  WOMPI_API: Joi.string().default('https://sandbox.wompi.co/v1'),
  PUBLIC_KEY: Joi.string(),
  PRIVATE_KEY: Joi.string(),
  DATABASE: Joi.string().default('car_now'),
  DB_HOST: Joi.string().default('carnow-db'),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().default('admin'),
  DB_PASSWORD: Joi.string().default('admin'),
  PORT: Joi.number().default(9000),
});
