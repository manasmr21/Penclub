import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request } from "express";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { ReviewService } from "./review.service";

@Controller("reviews")
export class ReviewController{
    constructor(
        private readonly reviewService: ReviewService
    ) { }

    @Get()
    async getAllReviews() {
        return await this.reviewService.getAll();
    }

    @Get("get-book/:bookId")
    async getReviewsPerBook(@Param("bookId") bookId: string) {
        return await this.reviewService.getPerBook(bookId);
    }

    @Get("get-user/:userId")
    async getReviewsPerUser(@Param("userId") userId: string) {
        return await this.reviewService.getPerUser(userId);
    }

    @Post("create")
    @UseGuards(AuthGuard("jwt"))
    async createReview(
        @Body() dto: CreateReviewDto,
        @Req() req: Request
    ) {
        return await this.reviewService.create(dto, req);
    }

    
    @Put("update/:reviewId")
    @UseGuards(AuthGuard("jwt"))
    async updateReview(
        @Param("reviewId") id: string,
        @Body() dto: UpdateReviewDto,
        @Req() req: Request
    ) {
        return await this.reviewService.update(id, dto, req);
    }

    @Delete("delete/:reviewId")
    @UseGuards(AuthGuard("jwt"))
    async deleteReview(
        @Param("reviewId") id: string,
        @Req() req: Request
    ) {
        return await this.reviewService.delete(id, req);
    }
}
