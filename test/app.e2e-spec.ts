import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AppService } from './../src/app.service';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
  

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let appService: AppService;
  
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

        app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
         
    appService = app.get(AppService);    
    await app.init();    
        await app.getHttpAdapter().getInstance().ready();
         
  });

  afterEach(async () => {
    await app.close();
  });  

  it('/ (GET)', () => {
    const response = appService.displayVersion();
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({ ret: response.ret, data: response.data });
  });
});
