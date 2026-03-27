import { BadRequestException, Injectable, HttpException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Book } from "./entities/books.entity";
import { CreateBookDto } from "./dto/create-book.dto";
import { AuthorEntity } from "../author/entities/author.entity";
import { CloudinaryService } from "src/utils/cloudinary/cloudinary.service";
import { UpdateBookDto } from "./dto/update-book.dto";

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private booksRepository: Repository<Book>,
        private cloudinaryService: CloudinaryService
    ) { }

    async getAllBooks() {
        try {
            const books = await this.booksRepository.find();

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

    async createBook(dto: CreateBookDto, file?: Express.Multer.File) {
        try {
            const { title, description, genre } = dto;

            if (!title || !description || !genre) throw new BadRequestException({
                success: false,
                message: "Title, description, and genre are required fields"
            });

            if (!dto.authorId) throw new BadRequestException({
                success: false,
                message: "Author is required"
            });

            if (file) {
                const folder = "books";
                const organization = "penclub";

                const cloudinaryResponse = await this.cloudinaryService.uploadImage(file, organization, folder);

                var coverImage = cloudinaryResponse.secure_url;
                var coverImageId = cloudinaryResponse.public_id;
            }

            const bookPayload = this.booksRepository.create({
                ...dto,
                author: { id: dto.authorId } as AuthorEntity,
                coverImage,
                coverImageId
            });

            const createdBook = await this.booksRepository.save(bookPayload);

            return {
                success: true,
                message: "Book created successfully",
                book: createdBook
            }
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async updateBook(id: string, dto: UpdateBookDto, file?: Express.Multer.File) {
        try {
            if (!dto) throw new BadRequestException({
                success: false,
                message: "No edit field recieved."
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
                message: "Book updated successfully",
                book: savedBook
            }
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async deleteBook(id: string) {
        try {
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
