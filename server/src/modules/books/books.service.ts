import { BadRequestException, Injectable, HttpException, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Book } from "./entities/books.entity";
import { CreateBookDto } from "./dto/create-book.dto";
import { AuthorEntity } from "../author/entities/author.entity";
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

    async getAllBooks() {
        try {
            const books = await this.booksRepository.find({
                where: {
                    state: "approved",
                    approved: true
                }
            });

            if (books.length === 0) throw new NotFoundException({
                success: true,
                message: "No books found."
            })

            return {
                success: true,
                message: "Books fetched successfully",
                books
            }

        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async getPendingbooks(req: any) {
        try {

            const userRole = req.user?.role

            if (userRole !== "admin") throw new UnauthorizedException({
                success: false,
                message: "You are not authorized."
            })

            const books = await this.booksRepository.find({
                where: {
                    approved: false
                }
            })

            if (books.length === 0) throw new NotFoundException({
                success: false,
                message: "No books found"
            })

            return {
                success: true,
                message: "Pending books fetched successfully",
                books
            }

        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async getPendingBooksPerAuthor(req: any) {
        try {
            const userId = req.user?.id
            const userRole = req.user?.role

            if(userRole !== "author") throw new UnauthorizedException({
                success: false,
                message: "You are not authorized"
            })

            const books = await this.booksRepository.find({
                where:{
                    id: userId,
                    approved: false
                }
            })

            if(books.length === 0) throw new NotFoundException({
                success: false,
                message: "No books found"
            })

            return{
                success: true,
                message: "Books fetched successfully",
                books
            }


        } catch (error) {

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

    async getBooksByAuthor(authorId: string) {
        try {

            const books = await this.booksRepository.createQueryBuilder("book")
                .where("book.authorId = :authorId", { authorId })
                .andWhere("book.approved = true")
                .select(["book.id", "book.title", "book.description", "book.genre", "book.coverImage",])
                .getMany();

            if (books.length === 0) throw new NotFoundException({
                success: false,
                message: "No books found for this author"
            })

            return {
                success: true,
                message: "Books fetched successfully",
                books
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

    async deleteBook(id: string, req) {
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

            const result = await this.booksRepository.delete(id);

            if (result.affected === 0) throw new NotFoundException({
                success: false,
                message: "Book not found, error in deleting the book"
            })

            if (book.coverImageId) await this.cloudinaryService.deleteImage(book.coverImageId);

            return {
                success: true,
                message: "Book deleted successfully."
            }
        } catch (error) {
            this.handleServiceError(error);
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
