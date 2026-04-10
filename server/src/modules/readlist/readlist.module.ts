import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Readlist } from "./entities/readlist.entity";
import { Book } from "../books/entities/books.entity";
import { ReadlistService } from "./readlist.service";
import { ReadlistController } from "./readlist.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Readlist, Book])],
    providers: [ReadlistService],
    controllers: [ReadlistController]
})
export class ReadlistModule { }
