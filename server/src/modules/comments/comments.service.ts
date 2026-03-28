import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "./entities/comment.entity";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Blog } from "../blog/entities/blogs.entity";

@Injectable()
export class CommentsService {

    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
        @InjectRepository(Blog)
        private blogRepository: Repository<Blog>
    ) { }

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

            if(!blog) throw new NotFoundException({
                success: false,
                message: "Blog not found"
            })

            if(dto.parentId) var parent = await this.commentRepository.exists({
                where:{
                    id: dto.parentId
                },
            }) 


            const comment = this.commentRepository.create({
                content,
                userId,
                blogId,
                parentId : dto.parentId ? dto.parentId : null
            })

            await this.commentRepository.save(comment);

            return{
                success: true,
                message: "Commented successfully"
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
