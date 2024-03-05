import { JsonResponse } from '@nathapp/common';
import { Public } from '@nathapp/nestjs-auth';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/')
  @Public()
  get() {
    return this.appService.displayVersion();
  }

  @Get('/liveness')
  @Public()
  liveness() {
    return JsonResponse.Ok({});
  }

  @Get('/readiness')
  @Public()
  readiness() {
    return JsonResponse.Ok({});
  }
}
