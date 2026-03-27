import { Injectable, BadRequestException, UnauthorizedException, NotFoundException, ConflictException, InternalServerErrorException, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Reader } from "./entities/reader.entity";
import { ReaderDto } from "./dto/reader.dto";
import bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "../../utils/sendMails";
import { randomInt } from "crypto";
import { VerifyOtpDto } from "../author/dto/verify-otp.dto";
import type { Response } from "express";
import { CloudinaryService } from "../../utils/cloudinary/cloudinary.service";


@Injectable()
export class ReaderService {
    constructor(
        @InjectRepository(Reader)
        private readerRepository: Repository<Reader>,
        private jwtService: JwtService,
        private mailService: MailService,
        private cloudinaryService: CloudinaryService
    ) { }

    private generateOtp(): string {
        return randomInt(100000, 1000000).toString();
    }

    private async getReaderByEmail(email: string) {
        const reader = await this.readerRepository.findOne({
            where: { email }
        });

        if (!reader) {
            throw new NotFoundException("Reader not found");
        }

        return reader;
    }

    async readerRegister(dto: ReaderDto, res: Response, file?: any) {
        try {
            const { name, email, username, password } = dto

            if (!email || !name || !username || !password) throw new BadRequestException({
                success: false,
                message: "All fields are required"
            });

            const existingUser = await this.readerRepository.findOne({
                where: [
                    { email },
                    { username }
                ],
            });

            if (existingUser) {
                let message = "User already exists";

                if (existingUser.email === email) {
                    message = "Email already in use";
                } else if (existingUser.username === username) {
                    message = "Username already taken";
                }

                throw new BadRequestException({
                    success: false,
                    message,
                });

            }

            const otp = this.generateOtp();
            const otpHash = await bcrypt.hash(otp, 10);
            const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

            const hashedPassword = await bcrypt.hash(password, 10);

            let profilePicture = dto.profilePicture;
            if (file) {
                const folder = "readers";
                const organization = "penclub";
                const cloudinaryResponse = await this.cloudinaryService.uploadImage(file, organization, folder);
                profilePicture = cloudinaryResponse.secure_url;
            }

            const user = this.readerRepository.create({
                ...dto,
                profilePicture,
                password: hashedPassword,
                otpHash,
                otpExpiresAt
            })

            const reader = await this.readerRepository.save(user);

            await this.mailService.sendMailService(email,
                "Verify your account",
                `Your OTP is ${otp}. It expires in 10 minutes.`)

            return {
                success: true,
                message: "OTP sent to your email. Please verify to complete registration.",
                reader: {
                    ...reader,
                    password: undefined
                }
            }
        } catch (error) {
            this.handleServiceError(error);
        }

    }

    async readerLogin(identifier: string, password: string, res: Response) {
        try {
            const result = await this.readerRepository.query(
                `SELECT "id", "email", "username", "password", "isEmailVerified"
                FROM readers
                WHERE "email" = $1 OR "username" = $1`,
                [identifier]
            );

            if (result.length === 0) return false;

            const dbPassword = result[0].password;
            const isMatch = await bcrypt.compare(password, dbPassword);
            if (!isMatch) return false;

            if (!result[0].isEmailVerified) {
                throw new UnauthorizedException({
                    success: true,
                    message: "Email not verified"
                });
            }

            const payload = {
                id: result[0].id,
                email: result[0].email,
                username: result[0].username
            };

            const token = this.jwtService.sign(payload);

            res.cookie("reader", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax"
            });

            return {
                success: true,
                message: "Login successful",
                data: payload
            };
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async updateProfile(id: any, readerUpdate: Partial<ReaderDto>, file?: any) {
        try {
            if(readerUpdate?.email || readerUpdate?.password) throw new BadRequestException({
                success: false,
                message: "Cannot update email or password without verification"
            })

            if (file) {
                const folder = "readers";
                const organization = "penclub";
                const cloudinaryResponse = await this.cloudinaryService.uploadImage(file, organization, folder);
                readerUpdate.profilePicture = cloudinaryResponse.secure_url;
            }

            const reader = await this.readerRepository.update(id, readerUpdate);

            if (reader.affected === 0) {
                throw new NotFoundException({
                    success: false,
                    message: "Reader not found"
                });
            }

            return {
                success: true,
                message: "Update successfully",
                reader
            }
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async deleteReader(id: any) {
        try {
            const result = await this.readerRepository.delete(id);

            if (result.affected === 0) {
                throw new NotFoundException({
                    success: false,
                    message: "Reader not found"
                });
            }

            return {
                success: true,
                message: "Reader deleted successfully"
            };
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async logout(res: Response) {
        try {
            res.clearCookie("reader", {
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

    private async verifyOtpInternal(email: string, otp: string, requireUnverified = false) {
        if (!email || !otp) {
            throw new BadRequestException("Email and OTP are required");
        }

        const reader = await this.getReaderByEmail(email);

        if (requireUnverified && reader.isEmailVerified) {
            throw new ConflictException("Email already verified");
        }

        if (!reader.otpHash || !reader.otpExpiresAt) {
            throw new BadRequestException("OTP not generated or expired");
        }

        const expiresAt = new Date(reader.otpExpiresAt);
        if (expiresAt.getTime() < Date.now()) {
            throw new BadRequestException("OTP expired");
        }

        const isMatch = await bcrypt.compare(otp, reader.otpHash);
        if (!isMatch) {
            throw new UnauthorizedException("Invalid OTP");
        }

        return reader;
    }

    async verifyEmail(dto: VerifyOtpDto) {
        try {
            const reader = await this.verifyOtpInternal(dto.email, dto.otp, true);

            await this.readerRepository.update(reader.id, {
                isEmailVerified: true,
                otpHash: null,
                otpExpiresAt: null
            });

            return {
                success: true,
                message: "Email verified successfully"
            };
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async verifyOtpOnly(dto: VerifyOtpDto) {
        try {
            await this.verifyOtpInternal(dto.email, dto.otp, false);

            return {
                success: true,
                message: "OTP verified successfully"
            };
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async resendEmail(email: string) {
        try {
            const result = await this.readerRepository.findOne({
                where: {
                    email: email
                }
            })

            if (!result) throw new NotFoundException({
                success: false,
                message: "This email is not registered"
            });

            if (result.isEmailVerified) throw new ConflictException({
                success: false,
                message: "This email is already verified."
            })

            const otp = this.generateOtp();
            const otpHash = await bcrypt.hash(otp, 10);
            const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

            await this.readerRepository.update(result.id, {
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
        } catch (error) {
            this.handleServiceError(error);
        }

    }

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
