import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly dataSource: DataSource
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/db-health")
  async dbHealth(){
    const result = await this.dataSource.query(
      'SELECT current_database(), version();'
    )

    return{
      conncted: true,
      database: result[0].current_database,
      version: result[0].version
    }

  }

}
