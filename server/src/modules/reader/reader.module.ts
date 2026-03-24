import { Module } from "@nestjs/common";
import { Reader } from "./entities/reader.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forFeature([Reader]),
    ],
    providers: [],
    controllers: []
})

export class AuthorModule { }
