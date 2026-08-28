// src/main.ts
import 'dotenv/config'; 
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Set Global Route Prefix (e.g., /api/v1)
  app.setGlobalPrefix('api/v1');

  // 2. Register Global Exception Filter (Converts 404, 500, etc. to Result Pattern)
  app.useGlobalFilters(new GlobalExceptionFilter());

  // 3. Enable Strict Global DTO Validation with Result-Pattern-Friendly Errors
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips non-DTO properties
      forbidNonWhitelisted: true, // Rejects extra properties with HTTP 400
      transform: true, // Transforms request payloads to DTO instances
      exceptionFactory: (errors) => {
        const messages: string[] = [];

        errors.forEach((err) => {
          if (err.constraints) {
            // استخراج كل رسالة DTO مستقلة كما هي دون دمج ودون إضافة اسم الحقل
            Object.values(err.constraints).forEach((constraintMsg) => {
              messages.push(constraintMsg);
            });
          }
        });

        return new BadRequestException(messages);
      },
    }),
  );

  // 4. Configure OpenAPI Document Builder
  const config = new DocumentBuilder()
    .setTitle('Naqla API Engine')
    .setDescription('Chess Tournament Management & Rating Engine API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 5. Mount Scalar API Reference UI on /reference
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
  console.log(`\n🚀 Naqla API Engine Server running at: http://localhost:${port}/api/v1`);
  console.log(`📖 Scalar API Reference running at: http://localhost:${port}/reference\n`);
}

bootstrap();