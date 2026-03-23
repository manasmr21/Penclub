import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { AuthorService } from "./author.service";
import { AuthorDto } from "./dto/register.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import type { Response } from "express";

@Controller('authors')
export class AuthorController{
   constructor(
      private authorService: AuthorService
   ){}

   @Get("get-authors")
   async getAuthors(){
      return await this.authorService.getAllAuthors();
   }

   @Get("get-author/:authorId")
   async getAuthorById(@Param("authorId") id: any){
      return await this.authorService.getAuthor(id);
   }

   @Post("create")
   async createAuthor(
      @Body() dto: AuthorDto
   ){
      return await this.authorService.register(dto); 
   }

   @Post("login")
   async login(
      @Body() credentials: {email: string, password: string},
      @Res({ passthrough: true }) res: Response
   ){
      return await this.authorService.authorLogin(credentials.email, credentials.password, res)
   }

   @Post("logout")
   async logout(@Res({ passthrough: true }) res: Response){
      return await this.authorService.logout(res);
   }

   @Post("verify-otp")
   async verifyOtp(
      @Body() dto: VerifyOtpDto,
      @Res({ passthrough: true }) res: Response
   ){
      return await this.authorService.verifyOtp(dto, res);
   }

   @Put("update/:authorId")
   async updateAuthor(@Param("authorId") id: any, @Body() dto: Partial<AuthorDto>){
      return await this.authorService.updateProfile(id, dto);
   }

   @Delete("delete/:authorId")
   async deleteAuthor(@Param("authorId") id: any){
      return await this.authorService.deleteAuthor(id);
   }
   
}
