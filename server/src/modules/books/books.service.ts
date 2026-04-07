import { BadRequestException, Injectable, HttpException, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Book } from "./entities/books.entity";
import { CreateBookDto } from "./dto/create-book.dto";
import { CloudinaryService } from "../../utils/cloudinary/cloudinary.service";
import { UpdateBookDto } from "./dto/update-book.dto";
import { User } from "../users/entities/user.entity";

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private booksRepository: Repository<Book>,
        private cloudinaryService: CloudinaryService,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async getAllBooks(page?: string | number, limit?: string | number) {
        try {
            const { page: currentPage, limit: currentLimit, skip } = this.normalizePagination(page, limit);

            const [books, total] = await this.booksRepository.findAndCount({
                where: {
                    state: "approved",
                    approved: true
                },
                order: {
                    createdAt: "DESC"
                },
                skip,
                take: currentLimit
            });

            if (total === 0) throw new NotFoundException({
                success: true,
                message: "No books found."
            })

            return {
                success: true,
                message: "Books fetched successfully",
                books,
                pagination: this.buildPaginationMeta(currentPage, currentLimit, total)
            }

        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async getPendingBooksPerAuthor(req: any, page?: string | number, limit?: string | number) {
        try {
            const { page: currentPage, limit: currentLimit, skip } = this.normalizePagination(page, limit);
            const userId = req.user?.id
            const userRole = req.user?.role

            if (userRole !== "author") throw new UnauthorizedException({
                success: false,
                message: "You are not authorized"
            })

            const [books, total] = await this.booksRepository.findAndCount({
                where: {
                    authorId: userId,
                    approved: false,
                    state: "pending"
                },
                order: {
                    createdAt: "DESC"
                },
                skip,
                take: currentLimit
            })

            if (total === 0) throw new NotFoundException({
                success: false,
                message: "No books found"
            })

            return {
                success: true,
                message: "Pending books fetched successfully",
                books,
                pagination: this.buildPaginationMeta(currentPage, currentLimit, total)
            }


        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async getBookById(id: string) {
        try {
            const book = await this.booksRepository.findOne({
                where: { id }
            });

            if (!book) throw new NotFoundException({
                success: false,
                message: "Book not found"
            })

            return {
                success: true,
                message: "Book fetched successfully",
                book
            }
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async getBooksByAuthor(authorId: string, page?: string | number, limit?: string | number) {
        try {
            const { page: currentPage, limit: currentLimit, skip } = this.normalizePagination(page, limit);

            const [books, total] = await this.booksRepository.createQueryBuilder("book")
                .where("book.authorId = :authorId", { authorId })
                .andWhere("book.approved = true")
                .andWhere("book.state = :state", { state: "approved" })
                .select(["book.id", "book.title", "book.description", "book.genre", "book.coverImage",])
                .orderBy("book.createdAt", "DESC")
                .skip(skip)
                .take(currentLimit)
                .getManyAndCount();

            if (total === 0) throw new NotFoundException({
                success: false,
                message: "No books found for this author"
            })

            return {
                success: true,
                message: "Books fetched successfully",
                books,
                pagination: this.buildPaginationMeta(currentPage, currentLimit, total)
            }

        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async createBook(dto: CreateBookDto, req: any, file?: any) {
        try {
            const { title, description, genre } = dto;
            const authorId = req.user?.id
            const role = req.user?.role

            if (!title || !description || !genre) throw new BadRequestException({
                success: false,
                message: "Title, description, and genre are required fields"
            });

            if (!authorId) throw new BadRequestException({
                success: false,
                message: "Not authorized"
            });

            if (role !== "author") throw new UnauthorizedException({
                success: false,
                message: "You are not authorized to publish a book"
            })

            if (file) {
                const folder = "books";
                const organization = "penclub";

                const cloudinaryResponse = await this.cloudinaryService.uploadImage(file, organization, folder);

                var coverImage = cloudinaryResponse.secure_url;
                var coverImageId = cloudinaryResponse.public_id;
            }

            const bookPayload = this.booksRepository.create({
                ...dto,
                authorId,
                coverImage,
                coverImageId
            });

            const createdBook = await this.booksRepository.save(bookPayload);

            return {
                success: true,
                message: "Book created successfully",
            }
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async updateBook(id: string, dto: UpdateBookDto, req: any, file?: any) {
        try {
            if (!dto) throw new BadRequestException({
                success: false,
                message: "No edit field recieved."
            })

            const role = req.user?.role

            if (role !== "author") throw new UnauthorizedException({
                success: false,
                message: "You are not authorized to upadte a book."
            })

            const book = await this.booksRepository.findOne({
                where: { id }
            })

            if (!book) throw new NotFoundException({
                success: false,
                message: "Book not found"
            })

            if (file) {
                if (book.coverImageId) await this.cloudinaryService.deleteImage(book.coverImageId);

                const folder = "books";
                const organization = "penclub";
                const cloudinaryResponse = await this.cloudinaryService.uploadImage(file, organization, folder);

                var coverImage = cloudinaryResponse.secure_url;
                var coverImageId = cloudinaryResponse.public_id;
                dto.coverImage = coverImage;
                dto.coverImageId = coverImageId;
            }

            if (dto.removeCoverImage && book.coverImageId) {
                await this.cloudinaryService.deleteImage(book.coverImageId);
            }

            const updatedBook = this.booksRepository.merge(book, dto);

            const savedBook = await this.booksRepository.save(updatedBook);

            return {
                success: true,
                message: "Book updated successfully"
            }
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async softDeleteBook(id: string, req: any) {
        try {

            const role = req.user?.role
            if (role !== "author") throw new UnauthorizedException({
                success: false,
                message: "You are not authorized to delete a book"
            })

            const book = await this.booksRepository.findOne({
                where: { id }
            })

            if (!book) throw new NotFoundException({
                success: false,
                message: "Book not found"
            })

            const result = await this.booksRepository.softDelete(id);

            if (result.affected === 0) throw new NotFoundException({
                success: false,
                message: "Book not found, error in deleting the book"
            })

            return {
                success: true,
                message: "Book deleted temporarily."
            }
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async permanentDeleteBook(id: string, req: any) {
        try {

            const role = req.user?.role
            if (role !== "author") throw new UnauthorizedException({
                success: false,
                message: "You are not authorized to delete a book"
            })

            const book = await this.booksRepository.findOne({
                where: { id },
                withDeleted: true
            })

            if (!book) throw new NotFoundException({
                success: false,
                message: "Book not found"
            })

            const result = await this.booksRepository.delete(id);

            if (result.affected === 0) throw new NotFoundException({
                success: false,
                message: "Book not found, error in deleting the book"
            })

            if (book.coverImageId) await this.cloudinaryService.deleteImage(book.coverImageId);

            return {
                success: true,
                message: "Book deleted permanently."
            }
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async getRecomendedBooks(req: any, page = 1, limit = 10) {
        try {
            const userId = req.user?.id;

            const user = await this.userRepository.findOne({
                where: { id: userId }
            });

            if (!user) {
                throw new UnauthorizedException({
                    success: false,
                    message: "User not logged in."
                });
            }

            const interests = user.interests || [];

            const skip = (page - 1) * limit;

            // --------------------------
            // 1️⃣ Interest-based books
            // --------------------------
            let interestBooks: Book[] = [];

            if (interests.length) {
                interestBooks = await this.booksRepository
                    .createQueryBuilder("book")
                    .where("book.genre = ANY(:interests)", { interests })
                    .andWhere("book.approved = true")
                    .orderBy("RANDOM()")
                    .skip(skip)
                    .take(Math.min(8, limit))
                    .getMany();
            }

            const remainingAfterInterest = limit - interestBooks.length;

            let trendingBooks: Book[] = [];

            if (remainingAfterInterest > 0) {
                trendingBooks = await this.booksRepository
                    .createQueryBuilder("book")
                    .leftJoin("book.reviews", "review")
                    .where("book.approved = true")
                    .andWhere(
                        interestBooks.length
                            ? "book.id NOT IN (:...ids)"
                            : "1=1",
                        { ids: interestBooks.map(b => b.id) }
                    )
                    .groupBy("book.id")
                    .orderBy("COUNT(review.id)", "DESC")
                    .skip(skip)
                    .take(remainingAfterInterest)
                    .getMany();
            }

            const combined = [...interestBooks, ...trendingBooks];

            const finalRemaining = limit - combined.length;

            let fallbackBooks: Book[] = [];

            if (finalRemaining > 0) {
                fallbackBooks = await this.booksRepository
                    .createQueryBuilder("book")
                    .where("book.approved = true")
                    .andWhere(
                        combined.length
                            ? "book.id NOT IN (:...ids)"
                            : "1=1",
                        { ids: combined.map(b => b.id) }
                    )
                    .orderBy("RANDOM()")
                    .skip(skip)
                    .take(finalRemaining)
                    .getMany();
            }

            const finalBooks = [...combined, ...fallbackBooks];

            return {
                success: true,
                message: "Books fetched successfully.",
                page,
                limit,
                count: finalBooks.length,
                books: finalBooks
            };
        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    private normalizePagination(page?: string | number, limit?: string | number) {
        const currentPage = page === undefined ? 1 : Number(page);
        const parsedLimit = limit === undefined ? 10 : Number(limit);

        if (!Number.isInteger(currentPage) || currentPage < 1) throw new BadRequestException({
            success: false,
            message: "Page must be a positive integer"
        })

        if (!Number.isInteger(parsedLimit) || parsedLimit < 1) throw new BadRequestException({
            success: false,
            message: "Limit must be a positive integer"
        })

        const currentLimit = Math.min(parsedLimit, 10);

        return {
            page: currentPage,
            limit: currentLimit,
            skip: (currentPage - 1) * currentLimit
        }
    }

    private buildPaginationMeta(page: number, limit: number, total: number) {
        const totalPages = Math.ceil(total / limit);

        return {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        }
    }

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
