import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, Response, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AdminService } from "./admin.service";
import { BooksService } from "../books/books.service";
import { SiteUpdateDto } from "./dto/site-update.dto";
import { CreatePublisherDto, UpdatePublisherDto } from "./dto/publisher.dto";

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
    async approveBook(@Request() req: any, @Param("bookId") bookId: string, @Body() approve: boolean) {
        return await this.adminService.approve(req, bookId, approve);
    }

    @Post("books/:bookId/advertise")
    @UseGuards(AuthGuard("jwt"))
    async advertiseBook(@Request() req: any, @Param("bookId") bookId: string, @Body("advertise") advertise: boolean) {
        return await this.adminService.advertiseBook(req, bookId, advertise);
    }

    @Get("pending")
    async getPendingBooksAdmin(@Request() req: any) {
        return await this.adminService.getPendingbooks(req);
    }

    @Post("users/soft-delete")
    @UseGuards(AuthGuard("jwt"))
    async softDeleteUser(@Request() req: any, @Body() userId: string) {
        return await this.adminService.softDeleteUser(req, userId);
    }

    @Post("users/permanent-delete")
    @UseGuards(AuthGuard("jwt"))
    async permanentDeleteUser(@Request() req: any, @Body() userId: string) {
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

    @Get("site")
    async getSiteData() {
        return await this.adminService.getSiteData();
    }

    @Put("site/update")
    @UseGuards(AuthGuard("jwt"))
    async updateSiteConfig(@Request() req: any, @Body() dto: SiteUpdateDto) {
        return await this.adminService.siteUpdate(req, dto);
    }

    @Post("publishers/create")
    @UseGuards(AuthGuard("jwt"))
    async addPublisher(@Request() req: any, @Body() dto: CreatePublisherDto) {
        return await this.adminService.addPublisher(req, dto);
    }

    @Get("publishers")
    @UseGuards(AuthGuard("jwt"))
    async getAllPublishers(@Request() req: any) {
        return await this.adminService.getAllPublishers(req);
    }

    @Get("publishers/:publisherId")
    @UseGuards(AuthGuard("jwt"))
    async getPublisherById(@Request() req: any, @Param("publisherId") publisherId: string) {
        return await this.adminService.getPublisherById(req, publisherId);
    }

    @Put("publishers/:publisherId/update")
    @UseGuards(AuthGuard("jwt"))
    async updatePublisher(@Request() req: any, @Param("publisherId") publisherId: string, @Body() dto: UpdatePublisherDto) {
        return await this.adminService.updatePublisher(req, publisherId, dto);
    }

    @Delete("publishers/:publisherId/soft")
    @UseGuards(AuthGuard("jwt"))
    async softDeletePublisher(@Request() req: any, @Param("publisherId") publisherId: string) {
        return await this.adminService.softDeletePublisher(req, publisherId);
    }

    @Delete("publishers/:publisherId/permanent")
    @UseGuards(AuthGuard("jwt"))
    async permanentDeletePublisher(@Request() req: any, @Param("publisherId") publisherId: string) {
        return await this.adminService.permanentDeletePublisher(req, publisherId);
    }
}
