// src/main.ts
import 'dotenv/config'; // ← MUST be first: populates process.env before any module loads

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable Strict Global DTO Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips non-DTO properties
      forbidNonWhitelisted: true, // Rejects extra properties with HTTP 400
      transform: true, // Transforms request payloads to DTO instances
    }),
  );

  // 2. Configure OpenAPI Document Builder
  const config = new DocumentBuilder()
    .setTitle('Naqla API Engine')
    .setDescription('Chess Tournament Management & Rating Engine API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 3. Mount Scalar API Reference UI on /reference
  app.use(
    '/reference',
    apiReference({
      spec: {
        content: document,
      },
      theme: 'purple',
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Scalar API Documentation running at: http://localhost:${port}/reference`);
}

bootstrap();