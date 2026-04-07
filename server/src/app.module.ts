import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import dataSource from './config/typeorm.config';
import { CloudinaryModule } from './utils/cloudinary/cloudinary.module';
import { BlogModule } from './modules/blog/blog.module';
import { BooksModule } from './modules/books/books.module';
import { UserModule } from './modules/users/user.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ReviewModule } from './modules/reviews/review.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ["server/.env", ".env"]
    }),
    TypeOrmModule.forRoot(dataSource.options),
    CloudinaryModule,
    BlogModule,
    BooksModule,
    UserModule,
    CommentsModule,
    ReviewModule,
    AdminModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
