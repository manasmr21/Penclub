import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, Response, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AdminService } from "./admin.service";
import { BooksService } from "../books/books.service";

@Controller("admin")
export class AdminController {
    constructor(
        private adminService: AdminService,
    ) { }

    //admin module different
    @Post("admin")
    async makeAdmin(@Body() dto: { email: string, password: string, confirmPassword: string }) {
        return await this.adminService.createAdmin(dto);
    }

    @Post("login")
    async loginAdmin(@Body() dto: { email: string, password: string }, @Response({ passthrough: true }) res: any) {
        return await this.adminService.loginAdmin(dto, res);
    }

    @Post("logout")
    @UseGuards(AuthGuard("jwt"))
    async logoutAdmin(@Response({ passthrough: true }) res: any, @Request() req: any) {
        return await this.adminService.logoutAdmin(res, req);
    }

    @Post("approve/:bookId")
    @UseGuards(AuthGuard("jwt"))
    async approveBook(@Request() req: any, @Param("bookId") bookId: string,@Body() approve: boolean) {
        return await this.adminService.approve(req, bookId, approve);
    }
    
    @Get("pending")
    async getPendingBooksAdmin(@Request() req: any) {
        return await this.adminService.getPendingbooks(req);
    }
    
    @Post("/soft-delete")
    @UseGuards(AuthGuard("jwt"))
    async softDeleteUser(@Request() req: any, @Body() userId: string){
        return await this.adminService.softDeleteUser(req, userId);
    }
    
    @Post("/permanent-delete")
    @UseGuards(AuthGuard("jwt"))
    async permanentDeleteUser(@Request() req: any, @Body() userId: string){
        return await this.adminService.permanentDelete(req, userId);
    }

    @Post("blogs/soft-delete")
    @UseGuards(AuthGuard("jwt"))
    async softDeleteBlog(@Request() req: any, @Body("blogId") blogId: string) {
        return await this.adminService.softDeleteBlog(req, blogId);
    }

    @Post("blogs/permanent-delete")
    @UseGuards(AuthGuard("jwt"))
    async permanentDeleteBlog(@Request() req: any, @Body("blogId") blogId: string) {
        return await this.adminService.permanentDeleteBlog(req, blogId);
    }

}
