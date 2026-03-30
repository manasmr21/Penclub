import { HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./entities/review.entity";
import { Repository } from "typeorm";
import { Book } from "../books/entities/books.entity";
import { CreateReviewDto } from "./dto/create-review.dto";

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,

        @InjectRepository(Book)
        private bookRepository: Repository<Book>
    ) { }


    async create(dto: CreateReviewDto) {
        try {
            
            

        } catch (error) {
            throw this.handleServiceError(error);
        }
    }


    //Error handler - to maker sure that errors does not make my server crash
    private handleServiceError(error: unknown): never {
        if (error instanceof HttpException) {
            throw error;
        }

        console.error(error);
        throw new InternalServerErrorException({
            success: false,
            message: "Internal server error"
        });
    }

}