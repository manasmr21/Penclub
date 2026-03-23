import {Body, Controller, Get, Param, Post, Put} from "@nestjs/common"
import { AuthorService } from "./author.service";
import { AuthorDto } from "./dto/register.dto";

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
   async createAuthor(@Body() dto: AuthorDto, res: Response){
      return await this.authorService.register(dto, res); 
   }

   @Post("login")
   async login(@Body() credentials: {email: string, password: string}, res: Response){
      return await this.authorService.authorLogin(credentials.email, credentials.password, res)
   }

   @Put("update/:authorId")
   async updateAuthor(@Param("authorId") id: any, @Body() dto: Partial<AuthorDto>){
      return await this.authorService.updateProfile(id, dto);
   }
   
}