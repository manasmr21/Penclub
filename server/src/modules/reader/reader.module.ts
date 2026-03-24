import { Module } from "@nestjs/common";
import { Reader } from "./entities/reader.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReaderService } from "./reader.service";
import { ReaderController } from "./reader.controller";
import { JwtAuthModule } from "../JWT/jwt.module";
import { MailModule } from "src/utils/mail.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Reader]),
        JwtAuthModule,
        MailModule
    ],
    providers: [ReaderService],
    controllers: [ReaderController]
})

export class ReaderModule { }
