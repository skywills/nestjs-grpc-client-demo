import { Public } from '@nathapp/nestjs-auth';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import {
  ClientGrpc,
  GrpcMethod,
  GrpcStreamMethod,
} from '@nestjs/microservices';
import { HeroById } from './hero-by-id.interface';
import { Hero } from './hero.interface';
import { Observable, map } from 'rxjs';
import { JsonResponse } from '@nathapp/nestjs-common';

interface HeroesService {
  findOne(data: HeroById): Observable<Hero>;
}

@Controller()
export class HeroesController {

  private heroesService: HeroesService;

  constructor(@Inject('HERO_PACKAGE') private readonly client: ClientGrpc) {}
  
  onModuleInit() {
    this.heroesService = this.client.getService<HeroesService>('HeroesService');
  }

  @Public()
  @Post('/hero')
  findOne(
    @Body() data: any,
  ) {
    return this.heroesService.findOne({ id: data.id }).pipe(map(hero => JsonResponse.Ok(hero)));
  }
}
