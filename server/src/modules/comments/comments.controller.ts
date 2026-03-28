import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { AuthGuard } from "@nestjs/passport";
import { CreateCommentDto } from "./dto/create-comment.dto";
import type { Request } from "express";

@Controller("comments")
export class CommentsController {
    constructor(
        private commentService: CommentsService
    ) { }


    @Post("create")
    @UseGuards(AuthGuard("jwt"))
    async createComment(
        @Body() dto: CreateCommentDto,
        @Req() req: Request
    ) {
        return this.commentService.create(dto, req);
    }

}
