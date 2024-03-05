import { JsonResponse } from '@nathapp/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  displayVersion(): any {
    return JsonResponse.Ok({
      version: `${process.env.npm_package_name} ${process.env.npm_package_version}`,
    });
  }

  appVersion(): string {
    return process.env.npm_package_version || '1.0.0-rc.0';
  }

  appName(): string {
    return process.env.npm_package_name || 'noname-app';
  }

  getAppInfo(): any {
    return {
      name: this.appName(),
      version: this.appVersion(),
      description: '',
    };
  }
}
