import { Body, Controller, Delete, Get, Param, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { BlogsService } from "./blogs.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("blogs")
export class BlogsController {
    constructor(
        private blogsService: BlogsService
    ) { }


    @Get()
    async getAll(){
        return await this.blogsService.getAllBlogs();
    }

    @Get("fetch/:userId")
    async fetchUsersBlogs(@Param("userId") id: string){
        return await this.blogsService.getUsersBlogs(id);
    }

    @Post("create")
    @UseGuards(AuthGuard("jwt"))
    @UseInterceptors(FileInterceptor("coverImage"))
    async createBlog(
        @Body() dto: CreateBlogDto,
        @Request() req: any,
        @UploadedFile() file?: any
    ) {
        return await this.blogsService.createBlog(dto, req, file);
    }
    
    @Put("update/:blogId")
    @UseGuards(AuthGuard("jwt"))
    @UseInterceptors(FileInterceptor("coverImage"))
    async updateBlog(@Param("blogId") id: string , @Body() dto:UpdateBlogDto, @UploadedFile(), @Request() req: any, file?: any, ){
        return await this.blogsService.updateBlog(id, dto, req, file);
    }

    @Delete("delete/:blogId")
    async deleteABlog(@Param("blogId")id: string, @Body() coverImageId : string, @Request() req: any ){
        return await this.blogsService.deleteBlog(id, coverImageId, req)
    }
}