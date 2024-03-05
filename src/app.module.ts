import {
  DefaultJwtModuleOptionsFactory,
  JwtModule,
  JwtRefreshGuard,
  JwtRefreshStrategy,
  JwtStrategy,
} from '@nathapp/nestjs-auth';
import { I18nCoreModule, LoggerMiddleware } from '@nathapp/nestjs-common';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { HeroesController } from './hero/heros.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DefaultJwtModuleOptionsFactory,
    }),
    I18nCoreModule.forRoot(),
    ClientsModule.register([
      {
        name: 'HERO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:8765',
          package: 'hero', // ['hero', 'hero2']
          protoPath: join(__dirname, './hero/hero.proto'), // ['./hero/hero.proto', './hero/hero2.proto']
        },
      }
    ]),
  ],
  controllers: [AppController, HeroesController],
  providers: [
    AppService,
    JwtModule,
    JwtStrategy,
    //JwtRefreshStrategy,
    //JwtRefreshGuard,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        { path: '/', method: RequestMethod.GET },
        { path: '/favicon.ico', method: RequestMethod.GET },
        { path: '/liveness', method: RequestMethod.GET },
        { path: '/readiness', method: RequestMethod.GET },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
