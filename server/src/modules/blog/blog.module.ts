import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blog } from "./entities/blogs.entity";
import { BlogsService } from "./blogs.service";
import { BlogsController } from "./blogs.controller";
import { CloudinaryModule } from "../../utils/cloudinary/cloudinary.module";

@Module({
    imports: [TypeOrmModule.forFeature([Blog]), CloudinaryModule],
    providers: [BlogsService],
    controllers: [BlogsController]
})
export class BlogModule { }
