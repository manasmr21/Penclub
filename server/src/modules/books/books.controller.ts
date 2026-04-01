import { Body, Controller, Delete, Get, Param, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { AuthGuard } from "@nestjs/passport";

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
    @UseGuards(AuthGuard("jwt"))
    @UseInterceptors(FileInterceptor("coverImage"))
    async create(
        @Body() dto: CreateBookDto,
        @Request() req: any,
        @UploadedFile() file?: any
    ) {
        return await this.booksService.createBook(dto, req, file);
    }
    
    @Put("update/:bookId")
    @UseGuards(AuthGuard("jwt"))
    @UseInterceptors(FileInterceptor("coverImage"))
    async update(
        @Param("bookId") id: string,
        @Body() dto: UpdateBookDto,
        @Request() req: any,
        @UploadedFile() file?: any
    ) {
        return await this.booksService.updateBook(id, dto, req, file);
    }
    
    @Delete("delete/:bookId")
    
    @UseGuards(AuthGuard("jwt"))
    async delete(@Param("bookId") id: string,@Request() req: any ) {
        return await this.booksService.deleteBook(id, req);
    }
}
