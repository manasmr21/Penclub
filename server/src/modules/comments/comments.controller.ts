import { Body, Controller, Delete, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { AuthGuard } from "@nestjs/passport";
import { CreateCommentDto } from "./dto/create-comment.dto";
import type { Request } from "express";
import { UpdateCommentDto } from "./dto/update-comment.dto";

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

    @Put("update/:commentId")
    async updateComment(@Param("commentId") id: string, @Body() dto: UpdateCommentDto){
        return await this.commentService.update(id, dto);
    }

    @Delete("delete/:commentId")
    async deleteComment(@Param("commentId") id: string, @Body() dto : {blogId : string}){
        return await this.commentService.delete(id, dto.blogId)

    }

}
