import { Module } from "@nestjs/common";
import { AuthorController } from "./author.controller";
import { AuthorService } from "./author.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthorEntity } from "./entities/author.entity";
import { JwtAuthModule } from "../JWT/jwt.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([AuthorEntity]),
        JwtAuthModule
    ],
    providers: [AuthorService],
    controllers: [AuthorController]
})

export class AuthorModule { }
