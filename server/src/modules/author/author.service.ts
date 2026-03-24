import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthorDto } from "./dto/register.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { AuthorEntity } from "./entities/author.entity";
import bcrypt from "bcryptjs"
import { JwtService } from "@nestjs/jwt";
import { MailService } from "src/utils/sendMails";
import type { Response } from "express";
import { randomInt } from "crypto";

@Injectable()
export class AuthorService {

    constructor(
        @InjectRepository(AuthorEntity)
        private authorRepository: Repository<AuthorEntity>,
        private jwtService: JwtService,
        private mailService : MailService
    ) { }

    private generateOtp(): string {
        return randomInt(100000, 1000000).toString();
    }

    async getAllAuthors(){
        const authors = await this.authorRepository.find()

        return {
            success: true,
            message: "Authors fetched successfully",
            authors
        }
    }

    async getAuthor(id: any){
        const author = await this.authorRepository.query(
            `SELECT * FROM authors WHERE ID = $1`, [id]
        )

        if(author.length === 0) throw new NotFoundException({
            success: false,
            message: "Author Not found"
        })

        return{
            success: true,
            message: "Author Fetched Successfully",
            author: {
                ...author[0], 
                password: undefined
            }
        }

    }

    async register(authorRegisterDto: AuthorDto) {
        try {
            const { name, penName, email, password } = authorRegisterDto;

            if (!name || !penName || !email || !password) throw new Error("All fields are required");

            const hashedPassword = await bcrypt.hash(password, 12)
            const otp = this.generateOtp();
            const otpHash = await bcrypt.hash(otp, 10);
            const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

            const result = await this.authorRepository.query(
                `INSERT INTO authors ("name", "penName", "email", "password", "otpHash", "otpExpiresAt", "isEmailVerified")
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT ("email") DO NOTHING
                RETURNING "id", "email", "penName"`,
                [name, penName, email, hashedPassword, otpHash, otpExpiresAt, false]
            )

            const penNameExist = await this.authorRepository.find({
                where:{
                    penName
                }
            })

            if(penNameExist) throw new ConflictException({
                success: false,
                message: "This pen name already exists"
            })

            const rows = Array.isArray(result[0]) ? result[0] : result;

            if (rows.length === 0) throw new ConflictException("Email already exists");

            await this.mailService.sendMailService(
                email,
                "Verify your account",
                `Your OTP is ${otp}. It expires in 10 minutes.`
            );

            return {
                success: true,
                message: "OTP sent to your email. Please verify to complete registration.",
                data: rows[0],
                otpExpiresInMinutes: 10
            }

        } catch (error) {

            throw error;

        }
    }

    async updateProfile(id: any,authorUpdate: Partial<AuthorDto>){

        console.log(authorUpdate, id);

        const author = await this.authorRepository.update(id, authorUpdate);

        if(author.affected === 0){
            throw new NotFoundException({
                success: false,
                message: "Author not found"
            });
        }

        return {
            success: true,
            message: "Update successfully",
            author
        }

    }

    async resendEmail(email: string){
        const result = await this.authorRepository.findOne({
            where:{
                email: email
            }
        })

        if(!result) throw new NotFoundException({
            success: false,
            message: "This email is not registered"
        });

        if(result.isEmailVerified) throw new ConflictException({
            success: false,
            message: "This email is already verified."
        })

        const otp = this.generateOtp();
        const otpHash = await bcrypt.hash(otp, 10);
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await this.authorRepository.update(result.id, {
            otpHash,
            otpExpiresAt
        });

        await this.mailService.sendMailService(
            email,
            "Verify your account",
            `Your OTP is ${otp}. It expires in 10 minutes.`
        );

        return {
            success: true,
            message: "OTP resent to your email",
            otpExpiresInMinutes: 10
        }

    }

    async deleteAuthor(id: any){
        const result = await this.authorRepository.delete(id);

        if(result.affected === 0){
            throw new NotFoundException({
                success: false,
                message: "Author not found"
            });
        }

        return {
            success: true,
            message: "Author deleted successfully"
        };
    }

    async authorLogin(identifier: string, password: string, res: Response) {
        try {

            const result = await this.authorRepository.query(
                `SELECT "id", "email", "penName", "password", "isEmailVerified" 
                FROM authors 
                WHERE "email" = $1 OR "penName" = $1`,
                [identifier]
            )

            if (result.length == 0) return false;

            const dbPassword = result[0].password

            const isMatch = await bcrypt.compare(password, dbPassword)

            if (!isMatch) return false;

            if (!result[0].isEmailVerified) {
                throw new UnauthorizedException("Email not verified");
            }

            const payload = {
                id: result[0].id,
                email: result[0].email,
                penName: result[0].penName
            }

            const token = this.jwtService.sign(payload)

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

    async logout(res: Response) {
        res.clearCookie("author", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        return {
            success: true,
            message: "Logged out successfully"
        };
    }

    async verifyOtp(dto: VerifyOtpDto, res: Response) {
        try {
            const { email, otp } = dto;

            if (!email || !otp) {
                throw new BadRequestException("Email and OTP are required");
            }

            const result = await this.authorRepository.query(
                `SELECT "id", "email", "penName", "otpHash", "otpExpiresAt", "isEmailVerified"
                FROM authors
                WHERE "email" = $1`,
                [email]
            );  

            if (result.length === 0) {
                throw new NotFoundException("Author not found");
            }

            const author = result[0];

            if (author.isEmailVerified) {
                throw new ConflictException("Email already verified");
            }

            if (!author.otpHash || !author.otpExpiresAt) {
                throw new BadRequestException("OTP not generated or expired");
            }

            const expiresAt = new Date(author.otpExpiresAt);
            if (expiresAt.getTime() < Date.now()) {
                throw new BadRequestException("OTP expired");
            }

            const isMatch = await bcrypt.compare(otp, author.otpHash);
            if (!isMatch) {
                throw new UnauthorizedException("Invalid OTP");
            }

            const updated = await this.authorRepository.query(
                `UPDATE authors
                SET "isEmailVerified" = true, "otpHash" = NULL, "otpExpiresAt" = NULL
                WHERE "id" = $1
                RETURNING "id", "email", "penName"`,
                [author.id]
            );

            const rows = Array.isArray(updated[0]) ? updated[0] : updated;
            const payload = rows[0];
            const token = this.jwtService.sign(payload);

            res.cookie("author", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax"
            });

            return {
                success: true,
                message: "Email verified successfully",
                data: payload
            };

        } catch (error) {
            throw error;
        }
    }
}
