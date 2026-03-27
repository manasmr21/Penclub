import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException, InternalServerErrorException, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthorDto } from "./dto/register.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { AuthorEntity } from "./entities/author.entity";
import bcrypt from "bcryptjs"
import { JwtService } from "@nestjs/jwt";
import { MailService } from "../../utils/sendMails";
import type { Response } from "express";
import { randomInt } from "crypto";
import { CloudinaryService } from "../../utils/cloudinary/cloudinary.service";

@Injectable()
export class AuthorService {

    constructor(
        @InjectRepository(AuthorEntity)
        private authorRepository: Repository<AuthorEntity>,
        private jwtService: JwtService,
        private mailService : MailService,
        private cloudinaryService: CloudinaryService
    ) { }

    private generateOtp(): string {
        return randomInt(100000, 1000000).toString();
    }

    async getAllAuthors(){
        try {
            const authors = await this.authorRepository.find()

            return {
                success: true,
                message: "Authors fetched successfully",
                authors
            }
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async getAuthor(id: any){
        try {
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
        } catch (error) {
            this.handleServiceError(error);
        }

    }

    async register(authorRegisterDto: AuthorDto, file?: any) {
        try {
            const { name, penName, email, password } = authorRegisterDto;

            if (!name || !penName || !email || !password) throw new BadRequestException("All fields are required");

            let profilePicture = authorRegisterDto.profilePicture;
            if (file) {
                const folder = "authors";
                const organization = "penclub";
                const cloudinaryResponse = await this.cloudinaryService.uploadImage(file, organization, folder);
                profilePicture = cloudinaryResponse.secure_url;
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const otp = this.generateOtp();
            const otpHash = await bcrypt.hash(otp, 10);
            const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

            const result = await this.authorRepository.query(
                `INSERT INTO authors ("name", "penName", "email", "password", "otpHash", "otpExpiresAt", "isEmailVerified", "profilePicture")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT ("email") DO NOTHING
                RETURNING "id", "email", "penName", "profilePicture"`,
                [name, penName, email, hashedPassword, otpHash, otpExpiresAt, false, profilePicture]
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
            this.handleServiceError(error);
        }
    }

    async updateProfile(id: any,authorUpdate: Partial<AuthorDto>, file?: any){
        try {
            if (file) {
                const folder = "authors";
                const organization = "penclub";
                const cloudinaryResponse = await this.cloudinaryService.uploadImage(file, organization, folder);
                authorUpdate.profilePicture = cloudinaryResponse.secure_url;
            }

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
        } catch (error) {
            this.handleServiceError(error);
        }

    }

    async resendEmail(email: string){
        try {
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
            const otpHashMns = await bcrypt.hash(otp, 10);
            const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

            await this.authorRepository.update(result.id, {
                otpHash : otpHashMns,
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
        } catch (error) {
            this.handleServiceError(error);
        }

    }

    async deleteAuthor(id: any){
        try {
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
        } catch (error) {
            this.handleServiceError(error);
        }
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

            const tokenMns = this.jwtService.sign(payload)

            res.cookie("author", tokenMns, {
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
            this.handleServiceError(error);
        }
    }

    async logout(res: Response) {
        try {
            res.clearCookie("author", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax"
            });

            return {
                success: true,
                message: "Logged out successfully"
            };
        } catch (error) {
            this.handleServiceError(error);
        }
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
            this.handleServiceError(error);
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
