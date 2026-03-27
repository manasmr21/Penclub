import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
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
   @UseInterceptors(FileInterceptor("profilePicture"))
   async createAuthor(
      @Body() dto: AuthorDto,
      @UploadedFile() file?: Express.Multer.File
   ){
      return await this.authorService.register(dto, file); 
   }

   @Post("login")
   async login(
      @Body() credentials: { email?: string, penName?: string, identifier?: string, password: string },
      @Res({ passthrough: true }) res: Response
   ){
      const identifier = credentials.email ?? credentials.penName ?? credentials.identifier;
      if (!identifier) {
         throw new BadRequestException("Email or penName is required");
      }

      return await this.authorService.authorLogin(identifier, credentials.password, res)
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

   @Post("resend-otp")
   async resendOtp(@Body("email") email: string){
      return await this.authorService.resendEmail(email);
   }

   @Put("update/:authorId")
   @UseInterceptors(FileInterceptor("profilePicture"))
   async updateAuthor(
      @Param("authorId") id: any,
      @Body() dto: Partial<AuthorDto>,
      @UploadedFile() file?: Express.Multer.File
   ){
      return await this.authorService.updateProfile(id, dto, file);
   }
   
}
