import { Module } from "@nestjs/common";
import { Reader } from "./entities/reader.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReaderService } from "./reader.service";
import { ReaderController } from "./reader.controller";
import { JwtAuthModule } from "../JWT/jwt.module";
import { MailModule } from "../../utils/mail.module";
import { CloudinaryModule } from "../../utils/cloudinary/cloudinary.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Reader]),
        JwtAuthModule,
        MailModule,
        CloudinaryModule
    ],
    providers: [ReaderService],
    controllers: [ReaderController]
})

export class ReaderModule { }
