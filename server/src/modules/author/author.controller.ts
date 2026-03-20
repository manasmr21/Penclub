import {Body, Controller, Get, Post} from "@nestjs/common"
import { AuthorService } from "./author.service";
import { AuthorRegisterDto } from "./dto/register.dto";

@Controller('authors')
export class AuthorController{
   constructor(
      private authorService: AuthorService
   ){}

   @Post("create")
   async createAuthor(@Body() dto: AuthorRegisterDto, res: Response){
      return await this.authorService.register(dto, res); 
   }

   @Post("login")
   async login(@Body() credentials: {email: string, password: string}, res: Response){
      return await this.authorService.authorLogin(credentials.email, credentials.password, res)
   }
   
}