import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "./entities/comment.entity";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Blog } from "../blog/entities/blogs.entity";
import { UpdateCommentDto } from "./dto/update-comment.dto";

@Injectable()
export class CommentsService {

    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
        @InjectRepository(Blog)
        private blogRepository: Repository<Blog>
    ) { }

    async getPerUser(userId: string) {
        try {

            const comment = await this.commentRepository
                .createQueryBuilder("comment")
                .leftJoin("comment.blog", "blog")
                .addSelect([
                    "blog.id",
                    "blog.title"
                ]).where("comment.userId = :userId", { userId })
                .getMany()

            if(comment.length === 0) throw new NotFoundException({
                success: false,
                message: "No comments found"
            })

            return{
                success: true,
                message: "Comments fetched successfully",
                comment
            }

        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async getPerBlog(blogId: string) {
        try {

            const comment = await this.commentRepository.createQueryBuilder("comment").leftJoinAndSelect("comment.replies", "replies").leftJoin("comment.user", "user").addSelect([
                "user.id",
                "user.name",
                "user.username",
                "user.role"
            ]).where("comment.blogId = :blogId", { blogId }).getMany()

            if(comment.length === 0) throw new NotFoundException({
                success: false,
                message: "No comments found."
            })



            return {
                success: true,
                message: "Comment fetched successfully",
                comment
            }

        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async create(dto: CreateCommentDto, req: { user?: { id?: string } }) {

        try {

            const { content, blogId } = dto;

            const userId = req.user?.id;
            if (!userId) throw new UnauthorizedException({
                success: false,
                message: "Unauthorized user"
            })

            if (!content || !blogId) throw new BadRequestException({
                success: false,
                message: "Error creating comment. Some fields are missing."
            })

            const blog = await this.blogRepository.exists({
                where: {
                    id: blogId
                }
            })

            if (!blog) throw new NotFoundException({
                success: false,
                message: "Blog not found"
            })

            if (dto.parentId) var parent = await this.commentRepository.exists({
                where: {
                    id: dto.parentId
                },
            })


            const comment = this.commentRepository.create({
                content,
                userId,
                blogId,
                parentId: dto.parentId ? dto.parentId : null
            })

            await this.commentRepository.save(comment);

            return {
                success: true,
                message: "Commented successfully"
            }

        } catch (error) {
            throw this.handleServiceError(error);
        }

    }

    async update(id: string, dto: UpdateCommentDto) {
        try {

            const comment = await this.commentRepository.findOne({
                where: {
                    id,
                    blogId: dto.blogId
                }
            })

            if (!comment) throw new NotFoundException({
                success: false,
                message: "Could not find the comment."
            })

            comment.content = dto.content
            comment.edited = true

            const updatedComment = await this.commentRepository.save(comment);

            return {
                success: true,
                message: "Edited successfully",
                comment: updatedComment
            }

        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async delete(id: string, blogId: string) {
        try {

            const deleted = await this.commentRepository.delete({
                id, blogId
            })

            if (deleted.affected === 0) throw new NotFoundException({
                success: false,
                message: "Comment Not Found"
            })

            return {
                success: true,
                message: "Comment deleted successfully."
            }

        } catch (error) {
            throw this.handleServiceError(error);
        }


    }

    //Error handler - to maker sure that errors does not make my server crash
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
