import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthorRegisterDto } from "./dto/register.dto";
import { AuthorEntity } from "./entities/author.entity";
import bcrypt from "bcryptjs"
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthorService {

    constructor(
        @InjectRepository(AuthorEntity)
        private authorRepository: Repository<AuthorEntity>,
        private jwtService: JwtService
    ) { }


    async register(authorRegisterDto: AuthorRegisterDto, res: Response) {
        try {
            const { name, penName, email, password } = authorRegisterDto;

            if (!name || !penName || !email || !password) throw new Error("All fields are required");

            const hashedPassword = await bcrypt.hash(password, 12)


            const result = await this.authorRepository.query(
                `INSERT INTO authors ("name", "penName", "email", "password")
                VALUES ($1, $2, $3, $4)
                ON CONFLICT ("email") DO NOTHING
                RETURNING "id", "email", "penName"`,
                [name, penName, email, hashedPassword]
            )

            if (result.length == 0) throw new ConflictException("Email already exists");

            const payload = result[0]

            const token = this.jwtService.sign(payload)

            //@ts-expect-error
            res.cookie("author", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "lax"
            })

            return {
                success: true,
                message: "Author registered successfully",
                data: result[0]
            }

        } catch (error) {

            throw error;

        }
    }

    async updateProfile(){
        
    }

    async authorLogin(email: string, password: string, res: Response) {
        try {

            const result = await this.authorRepository.query(
                `SELECT "id", "email", "penName", "password" 
                FROM authors 
                WHERE "email" = $1`,
                [email]
            )

            if (result.length == 0) return false;

            const dbPassword = result[0].password

            const isMatch = await bcrypt.compare(password, dbPassword)

            if (!isMatch) return false;

            const payload = {
                id: result[0].id,
                email: result[0].email,
                penName: result[0].penName
            }

            const token = this.jwtService.sign(payload)

            //@ts-expect-error
            res.cookie("author", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "lax"
            })

            return {
                success: true,
                message: "Login successful",
                data: result[0]
            }

        } catch (error) {
            throw error;
        }
    }

}
