import { Injectable, BadRequestException, InternalServerErrorException, HttpException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Blog } from "./entities/blogs.entity";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { CloudinaryService } from "../../utils/cloudinary/cloudinary.service";
import { UpdateBlogDto } from "./dto/update-blog.dto";


@Injectable()
export class BlogsService {
    private readonly approvedBlogStatuses = ["posted", "edited"];

    constructor(
        @InjectRepository(Blog)
        private blogsRepository: Repository<Blog>,
        private cloudinaryService: CloudinaryService
    ) { }

    async getAllBlogs(page?: string | number, limit?: string | number) {
        try {
            const { page: currentPage, limit: currentLimit, skip } = this.normalizePagination(page, limit);

            const [blogs, total] = await this.blogsRepository.createQueryBuilder("blog")
                .where("blog.status IN (:...statuses)", { statuses: this.approvedBlogStatuses })
                .orderBy("blog.createdAt", "DESC")
                .skip(skip)
                .take(currentLimit)
                .getManyAndCount();

            if (total === 0) throw new NotFoundException({
                success: true,
                message: "No blogs found."
            })

            return {
                success: true,
                message: "Blogs fetched successfully",
                blogs,
                pagination: this.buildPaginationMeta(currentPage, currentLimit, total)
            }

        } catch (error) {
            this.handleServiceError(error);
        }

    }

    async getBlog(id: string){
        try {

            if(!id) throw new BadRequestException({
                success: false,
                message: "Blog id is required"
            })

            const blog = this.blogsRepository.findOne({
                where:{
                    id
                }
            })

            if(!blog) throw new NotFoundException({
                success: false,
                message: "Blog with this blog id is not found"
            })

            return{
                success: true,
                message: "blog fetched successfully",
                blog
            }


        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async getUsersBlogs(id: string, page?: string | number, limit?: string | number) {

        try {
            const { page: currentPage, limit: currentLimit, skip } = this.normalizePagination(page, limit);

            const [blogs, total] = await this.blogsRepository.createQueryBuilder("blog")
                .leftJoinAndSelect("blog.user", "user")
                .where("blog.userId = :userId", { userId: id })
                .andWhere("blog.status IN (:...statuses)", { statuses: this.approvedBlogStatuses })
                .orderBy("blog.createdAt", "DESC")
                .skip(skip)
                .take(currentLimit)
                .getManyAndCount();

            if (total === 0) throw new NotFoundException({
                success: true,
                message: "No blogs found.",
            })

            return {
                success: true,
                message: "Blogs fetched successfully",
                blogs,
                pagination: this.buildPaginationMeta(currentPage, currentLimit, total)
            }

        } catch (error) {
            this.handleServiceError(error);
        }

    }

    async getPendingBlogsPerAuthor(req: any, page?: string | number, limit?: string | number) {
        try {
            const { page: currentPage, limit: currentLimit, skip } = this.normalizePagination(page, limit);
            const userId = req.user?.id
            const userRole = req.user?.role

            if(userRole !== "author") throw new UnauthorizedException({
                success: false,
                message: "You are not authorized"
            })

            const [blogs, total] = await this.blogsRepository.createQueryBuilder("blog")
                .where("blog.userId = :userId", { userId })
                .andWhere("blog.status = :status", { status: "pending" })
                .orderBy("blog.createdAt", "DESC")
                .skip(skip)
                .take(currentLimit)
                .getManyAndCount();

            if (total === 0) throw new NotFoundException({
                success: false,
                message: "No blogs found."
            })

            return {
                success: true,
                message: "Pending blogs fetched successfully",
                blogs,
                pagination: this.buildPaginationMeta(currentPage, currentLimit, total)
            }
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async createBlog(dto: CreateBlogDto, req: any, file?: any) {
        try {

            const userRole = req.user?.role
            if(userRole !== "author") throw new UnauthorizedException({
                success: false,
                message: "You are not authorized to post articles."
            })

            const { title, content, status } = dto;

            if (!title || !content) throw new BadRequestException({
                success: false,
                message: "Title and content are required fields"
            })

            if (file) {
                const folder = "blogs";
                const organization = "penclub"

                const cloudinaryResponse = await this.cloudinaryService.uploadImage(file, organization, folder);

                var coverImage = cloudinaryResponse.secure_url;

                var coverImageId = cloudinaryResponse.public_id;
            }

            const blogMns = this.blogsRepository.create({
                ...dto,
                userId: dto.userId,
                status: status || "posted",
                coverImage,
                coverImageId
            });

            const createdBlog = await this.blogsRepository.save(blogMns);

            return {
                success: true,
                message: "Blog posted successfully",
                blog: createdBlog
            }
        } catch (error) {
            this.handleServiceError(error);
        }
    }


    async updateBlog(id: string, dto: UpdateBlogDto, req : any, file?: any) {

        try {

            const userRole = req.user?.role

            if(userRole !== "author") throw new UnauthorizedException({
                success: false,
                message: "You are not authorized to update an article"
            })

            if (!dto) throw new BadRequestException({
                success: false,
                message: "No edit field recieved."
            })

            const blog = await this.blogsRepository.findOne({
                where: {
                    id
                }
            })

            if (!blog) throw new NotFoundException({
                success: false,
                message: "Blog not found"
            })

            if (file) {
                if (blog.coverImage) await this.cloudinaryService.deleteImage(dto.coverImageId);

                const folder = "blogs"
                const organization = "penclub"
                const cloudinaryResponse = await this.cloudinaryService.uploadImage(file, organization, folder)

                var coverImage = cloudinaryResponse.secure_url;
                var coverImageId = cloudinaryResponse.public_id
                dto.coverImage = coverImage;
                dto.coverImageId = coverImageId
            }


            if (dto.removeCoverImage) await this.cloudinaryService.deleteImage(dto.coverImageId);

            dto.status = "edited"

            const updatedBlog = this.blogsRepository.merge(blog, dto)

            const newBlog = await this.blogsRepository.save(updatedBlog);

            return {
                success: true,
                message: "Blog updated successfully",
                blog: newBlog
            }
        } catch (error) {
            this.handleServiceError(error);
        }

    }

    async deleteBlog(id: string, coverImageId: string, req: any) {
        try {

            const userRole = req.user?.role

            if(userRole !== "author") throw new UnauthorizedException({
                success: false,
                message: "You are not authorized to delete a blog"
            })

            const blog = await this.blogsRepository.delete(id)

            if(blog.affected === 0) throw new NotFoundException({
                success: false,
                message: "Blog not found, error in deleting the blog"
            })

            //@ts-expect-error
            const response = await this.cloudinaryService.deleteImage(coverImageId.coverImageId);

            return{
                success: true,
                message: "Blog deleted successfully.",
                response
            }

        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async getRecomendedBlogs(){
        
    }

    private normalizePagination(page?: string | number, limit?: string | number) {
        const currentPage = page === undefined ? 1 : Number(page);
        const parsedLimit = limit === undefined ? 10 : Number(limit);

        if (!Number.isInteger(currentPage) || currentPage < 1) throw new BadRequestException({
            success: false,
            message: "Page must be a positive integer"
        })

        if (!Number.isInteger(parsedLimit) || parsedLimit < 1) throw new BadRequestException({
            success: false,
            message: "Limit must be a positive integer"
        })

        const currentLimit = Math.min(parsedLimit, 10);

        return {
            page: currentPage,
            limit: currentLimit,
            skip: (currentPage - 1) * currentLimit
        }
    }

    private buildPaginationMeta(page: number, limit: number, total: number) {
        const totalPages = Math.ceil(total / limit);

        return {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
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
