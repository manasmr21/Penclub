import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Reader } from "./entities/reader.entity";
import { ReaderDto } from "./dto/reader.dto";

@Injectable()
export class ReaderService{
    constructor(
        @InjectRepository(Reader)
        private readerRepository: Repository<Reader>
    ){}

    async readerRegister(dto: ReaderDto){
        
    }
}