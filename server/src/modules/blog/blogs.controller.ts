import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { BlogsService } from "./blogs.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";

@Controller("blogs")
export class BlogsController {
    constructor(
        private blogsService: BlogsService
    ) { }


    @Get()
    async getAll(){
        return await this.blogsService.getAllBlogs();
    }

    @Get("fetch/:authorId")
    async fetchAuthorsBlogs(@Param("authorId") id: string){
        return await this.blogsService.getAuthorsBlogs(id);
    }

    @Post("create")
    @UseInterceptors(FileInterceptor("coverImage"))
    async createBlog(
        @Body() dto: CreateBlogDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return await this.blogsService.createBlog(dto, file);
    }

    @Put("update/:blogId")
    @UseInterceptors(FileInterceptor("coverImage"))
    async updateBlog(@Param("blogId") id: string , @Body() dto:UpdateBlogDto, @UploadedFile() file?: Express.Multer.File){
        return await this.blogsService.updateBlog(id, dto, file);
    }

    @Delete("delete/:blogId")
    async deleteABlog(@Param("blogId")id: string, @Body() coverImageId : string ){
        return await this.blogsService.deleteBlog(id, coverImageId)
    }
}