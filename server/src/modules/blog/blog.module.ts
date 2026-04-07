import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blog } from "./entities/blogs.entity";
import { BlogsService } from "./blogs.service";
import { BlogsController } from "./blogs.controller";
import { CloudinaryModule } from "../../utils/cloudinary/cloudinary.module";
import { User } from "../users/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Blog, User]), CloudinaryModule],
    providers: [BlogsService],
    controllers: [BlogsController]
})
export class BlogModule { }
