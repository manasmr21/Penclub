import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
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
    async getAll(@Query("page") page?: string, @Query("limit") limit?: string) {
        return await this.booksService.getAllBooks(page, limit);
    }

    @Get("author/:authorId")
    async getByAuthor(
        @Param("authorId") authorId: string,
        @Query("page") page?: string,
        @Query("limit") limit?: string
    ) {
        return await this.booksService.getBooksByAuthor(authorId, page, limit);
    }

    @Get("pending-author")
    @UseGuards(AuthGuard("jwt"))
    async getPendingBooksAuthor(
        @Request() req: any,
        @Query("page") page?: string,
        @Query("limit") limit?: string
    ) {
        return await this.booksService.getPendingBooksPerAuthor(req, page, limit);
    }

    @Get("recommended")
    @UseGuards(AuthGuard("jwt"))
    async getRecommended(
        @Request() req: any,
        @Query("page") page?: string,
        @Query("limit") limit?: string
    ) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 10;
        return await this.booksService.getRecomendedBooks(req, pageNumber, limitNumber);
    }

    @Get(":bookId")
    async getOne(@Param("bookId") id: string) {
        return await this.booksService.getBookById(id);
    }

    @Post("create")
    @UseGuards(AuthGuard("jwt"))
    @UseInterceptors(AnyFilesInterceptor())
    async create(
        @Body() dto: CreateBookDto,
        @Request() req: any,
        @UploadedFiles() files?: any[]
    ) {
        return await this.booksService.createBook(dto, req, files);
    }
    
    @Put("update/:bookId")
    @UseGuards(AuthGuard("jwt"))
    @UseInterceptors(AnyFilesInterceptor())
    async update(
        @Param("bookId") id: string,
        @Body() dto: UpdateBookDto,
        @Request() req: any,
        @UploadedFiles() files?: any[]
    ) {
        return await this.booksService.updateBook(id, dto, req, files);
    }
    
    @Delete("soft-delete/:bookId")
    @UseGuards(AuthGuard("jwt"))
    async softDelete(@Param("bookId") id: string, @Request() req: any) {
        return await this.booksService.softDeleteBook(id, req);
    }

    @Delete("delete/:bookId")
    @UseGuards(AuthGuard("jwt"))
    async delete(@Param("bookId") id: string, @Request() req: any) {
        return await this.booksService.softDeleteBook(id, req);
    }

    @Delete("permanent-delete/:bookId")
    @UseGuards(AuthGuard("jwt"))
    async permanentDelete(@Param("bookId") id: string, @Request() req: any) {
        return await this.booksService.permanentDeleteBook(id, req);
    }

}
