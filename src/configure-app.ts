import * as helmet from 'helmet';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { initSwagger } from './shared/swagger.initializer';
import { ConfigService } from '@nestjs/config';

export function configureApp(
  app: INestApplication,
  configService: ConfigService,
): void {
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      forbidUnknownValues: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.enableCors({
    origin: configService.get<string>('api.allowedCorsOrigin'),
  });
  app.use(
    (helmet as any)({
      contentSecurityPolicy: false,
    }),
  );

  initSwagger(app);
}
