import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { Blog } from '../blog/entities/blogs.entity';
import { JwtAuthModule } from '../JWT/jwt.module';
import { BlogModule } from '../blog/blog.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Blog]), JwtAuthModule, BlogModule],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
