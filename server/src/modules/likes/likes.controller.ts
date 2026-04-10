import { Controller, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { LikesService } from "./likes.service";

@Controller("likes")
@UseGuards(AuthGuard("jwt"))
export class LikesController {
    constructor(private likesService: LikesService) { }

    @Post("book/:bookId")
    async toggleBookLike(@Param("bookId") bookId: string, @Request() req: any) {
        return this.likesService.toggleBookLike(bookId, req.user.id);
    }

    @Post("blog/:blogId")
    async toggleBlogLike(@Param("blogId") blogId: string, @Request() req: any) {
        return this.likesService.toggleBlogLike(blogId, req.user.id);
    }

    @Get("book/:bookId/status")
    async getBookLikeStatus(@Param("bookId") bookId: string, @Request() req: any) {
        return this.likesService.getBookLikeStatus(bookId, req.user.id);
    }

    @Get("blog/:blogId/status")
    async getBlogLikeStatus(@Param("blogId") blogId: string, @Request() req: any) {
        return this.likesService.getBlogLikeStatus(blogId, req.user.id);
    }
}
