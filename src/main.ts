import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { bootstrapSeed } from './seed';

async function bootstrap() {
  await bootstrapSeed();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(3000);
  Logger.log(`🚀 Application is running on: http://localhost:${3000}`);
}
bootstrap();
