import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailModule } from "../../utils/mail.module";
import { CloudinaryModule } from "../../utils/cloudinary/cloudinary.module";
import { JwtAuthModule } from "../JWT/jwt.module";
import { User } from "../users/entities/user.entity";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { Book } from "../books/entities/books.entity";
import { BooksService } from "../books/books.service";
import { Blog } from "../blog/entities/blogs.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Book, Blog]),
        MailModule,
        CloudinaryModule,
        JwtAuthModule
    ],
    providers: [AdminService, BooksService],
    controllers: [AdminController],
    exports: [AdminService]
})
export class AdminModule {}
