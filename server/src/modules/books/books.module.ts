import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Book } from "./entities/books.entity";
import { BooksService } from "./books.service";
import { BooksController } from "./books.controller";
import { CloudinaryModule } from "../../utils/cloudinary/cloudinary.module";

@Module({
    imports: [TypeOrmModule.forFeature([Book]), CloudinaryModule],
    providers: [BooksService],
    controllers: [BooksController]
})
export class BooksModule { }
