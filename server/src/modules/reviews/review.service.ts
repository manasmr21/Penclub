import {
    BadRequestException,
    HttpException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./entities/review.entity";
import { Repository } from "typeorm";
import { Book } from "../books/entities/books.entity";
import { User } from "../users/entities/user.entity";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,

        @InjectRepository(Book)
        private bookRepository: Repository<Book>
    ) { }

    private createReviewQuery() {
        return this.reviewRepository
            .createQueryBuilder("review")
            .leftJoinAndMapOne("review.user", User, "user", "user.id = review.userId")
            .leftJoinAndMapOne("review.book", Book, "book", "book.id = review.bookId")
            .addSelect([
                "user.id",
                "user.name",
                "user.username",
                "user.profilePicture",
                "user.role",
                "book.id",
                "book.title",
                "book.coverImage",
                "book.genre"
            ]);
    }

    async getAll() {
        try {
            const reviews = await this.createReviewQuery()
                .orderBy("review.createdAt", "DESC")
                .getMany();

            if (reviews.length === 0) {
                throw new NotFoundException({
                    success: false,
                    message: "No reviews found"
                });
            }

            return {
                success: true,
                message: "Reviews fetched successfully",
                reviews
            };
        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async getPerBook(bookId: string) {
        try {
            const reviews = await this.createReviewQuery()
                .where("review.bookId = :bookId", { bookId })
                .orderBy("review.createdAt", "DESC")
                .getMany();

            if (reviews.length === 0) {
                throw new NotFoundException({
                    success: false,
                    message: "No reviews found for this book"
                });
            }

            return {
                success: true,
                message: "Book reviews fetched successfully",
                reviews
            };
        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async getPerUser(userId: string) {
        try {
            const reviews = await this.createReviewQuery()
                .where("review.userId = :userId", { userId })
                .orderBy("review.createdAt", "DESC")
                .getMany();

            if (reviews.length === 0) {
                throw new NotFoundException({
                    success: false,
                    message: "No reviews found for this user"
                });
            }

            return {
                success: true,
                message: "User reviews fetched successfully",
                reviews
            };
        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async create(dto: CreateReviewDto, req: { user?: { id?: string } }) {
        try {

            const {rating, content, bookId} = dto;
            const userId = req.user?.id;

            if (!userId) {
                throw new UnauthorizedException({
                    success: false,
                    message: "Unauthorized user"
                });
            }

            if(rating < 1 || rating > 5) {
                throw new HttpException({
                    success: false,
                    message: "Rating must be between 1 and 5"
                }, 400);
            }

            if(!bookId) throw new HttpException({
                success: false,
                message: "Book id is required"
            }, 400)


            const book = await this.bookRepository.findOneBy({id: bookId});

            if(!book) {
                throw new HttpException({
                    success: false,
                    message: "Book not found"
                }, 404);
            }

            const review = this.reviewRepository.create({
                rating,
                content,
                userId,
                bookId
            });

            await this.reviewRepository.save(review);

            return {
                success: true,
                message: "Review created successfully",
                review
            };

        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async update(id: string, dto: UpdateReviewDto, req: { user?: { id?: string } }) {
        try {
            const { rating, content } = dto;
            const userId = req.user?.id;

            if (!userId) {
                throw new UnauthorizedException({
                    success: false,
                    message: "Unauthorized user"
                });
            }

            if (typeof rating === "undefined" && typeof content === "undefined") {
                throw new BadRequestException({
                    success: false,
                    message: "At least one field is required to update the review"
                });
            }

            if (typeof rating !== "undefined" && (rating < 1 || rating > 5)) {
                throw new BadRequestException({
                    success: false,
                    message: "Rating must be between 1 and 5"
                });
            }

            const review = await this.reviewRepository.findOne({
                where: { id, userId }
            });

            if (!review) {
                throw new NotFoundException({
                    success: false,
                    message: "Review not found or you are not allowed to update it"
                });
            }

            if (typeof rating !== "undefined") {
                review.rating = rating;
            }

            if (typeof content !== "undefined") {
                review.content = content;
            }

            review.edited = true;

            const updatedReview = await this.reviewRepository.save(review);

            return {
                success: true,
                message: "Review updated successfully",
                review: updatedReview
            };

        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async delete(id: string, req: { user?: { id?: string } }) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                throw new UnauthorizedException({
                    success: false,
                    message: "Unauthorized user"
                });
            }

            const review = await this.reviewRepository.findOne({
                where: { id, userId }
            });

            if (!review) {
                throw new NotFoundException({
                    success: false,
                    message: "Review not found or you are not allowed to delete it"
                });
            }

            await this.reviewRepository.remove(review);

            return {
                success: true,
                message: "Review deleted successfully"
            };

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
