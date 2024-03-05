import { AppFactory } from '@nathapp/nestjs-app';
import { getLoggerLevel } from '@nathapp/nestjs-common';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
    const app = await AppFactory.createFastifyApp(AppModule, {
    logger: getLoggerLevel(),
  });
   
  const appService = app.get(AppService);
  app
    .useAppGlobalPipes()
    .useAppGlobalPrefix()
    .useAppGlobalFilters()
    .useAppGlobalGuards()
    .useSwaggerUIOnDevOnly(appService.getAppInfo());

  await app.start();
}
bootstrap();
