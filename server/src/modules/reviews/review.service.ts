import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./entities/review.entity";
import { Repository } from "typeorm";
import { Blog } from "../blog/entities/blogs.entity";

@Injectable()
export class ReviewService{
    constructor(
        @InjectRepository(Review)
        private reviewRepository : Repository<Review>,
        
        @InjectRepository(Blog)
        private blogRepository : Repository<Blog>
    ){}

}