import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";

@Controller("books")
export class BooksController {
    constructor(
        private booksService: BooksService
    ) { }

    @Get()
    async getAll() {
        return await this.booksService.getAllBooks();
    }

    @Get(":bookId")
    async getOne(@Param("bookId") id: string) {
        return await this.booksService.getBookById(id);
    }

    @Post("create")
    @UseInterceptors(FileInterceptor("coverImage"))
    async create(
        @Body() dto: CreateBookDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return await this.booksService.createBook(dto, file);
    }

    @Put("update/:bookId")
    @UseInterceptors(FileInterceptor("coverImage"))
    async update(
        @Param("bookId") id: string,
        @Body() dto: UpdateBookDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return await this.booksService.updateBook(id, dto, file);
    }

    @Delete("delete/:bookId")
    async delete(@Param("bookId") id: string) {
        return await this.booksService.deleteBook(id);
    }
}
