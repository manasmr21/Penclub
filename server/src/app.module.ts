import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import dataSource from './config/typeorm.config';
import { AuthorModule } from './modules/author/author.module';
import { ReaderModule } from './modules/reader/reader.module';
import { CloudinaryModule } from './utils/cloudinary/cloudinary.module';
import { BlogModule } from './modules/blog/blog.module';
import { BooksModule } from './modules/books/books.module';
import { UserModule } from './modules/users/user.module';
import { CommentsModule } from './modules/comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true,
      envFilePath: ["server/.env", ".env"]
    }),
    TypeOrmModule.forRoot(dataSource.options),
    AuthorModule,
    ReaderModule,
    CloudinaryModule,
    BlogModule,
    BooksModule,
    UserModule,
    CommentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
