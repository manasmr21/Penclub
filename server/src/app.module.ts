import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import dataSource from './config/typeorm.config';
import { AuthorModule } from './modules/author/author.module';
import { ReaderModule } from './modules/reader/reader.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot(dataSource.options),
    AuthorModule,
    ReaderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
