import { Module } from "@nestjs/common";
import { AuthorController } from "./author.controller";
import { AuthorService } from "./author.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthorEntity } from "./entities/author.entity";
import { JwtAuthModule } from "../JWT/jwt.module";
import { MailModule } from "../../utils/mail.module";
import { CloudinaryModule } from "../../utils/cloudinary/cloudinary.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([AuthorEntity]),
        JwtAuthModule,
        MailModule,
        CloudinaryModule
    ],
    providers: [AuthorService],
    controllers: [AuthorController]
})

export class AuthorModule { }
