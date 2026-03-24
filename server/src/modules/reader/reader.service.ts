import { Injectable, Inject, BadRequestException, UnauthorizedException, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Reader } from "./entities/reader.entity";
import { ReaderDto } from "./dto/reader.dto";
import bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "src/utils/sendMails";
import { randomInt } from "crypto";
import { VerifyOtpDto } from "../author/dto/verify-otp.dto";
import type { Response } from "express";


@Injectable()
export class ReaderService {
    constructor(
        @InjectRepository(Reader)
        private readerRepository: Repository<Reader>,
        private jwtService: JwtService,
        private mailService: MailService
    ) { }

    private generateOtp(): string {
        return randomInt(100000, 1000000).toString();
    }

    async readerRegister(dto: ReaderDto) {
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

        const user = this.readerRepository.create({
            ...dto,
            password: hashedPassword,
            otpHash,
            otpExpiresAt
        })

        const reader = await this.readerRepository.save(user);

        this.mailService.sendMailService(email,
            "Verify your account",
            `Your OTP is ${otp}. It expires in 10 minutes.`)

        return {
            success: true,
            message: "Account Created Successfully",
            reader: {
                ...reader,
                password: undefined
            }
        }

    }

    async verifyOtp(dto: VerifyOtpDto, res: Response) {
        try {
            const { email, otp } = dto;

            if (!email || !otp) {
                throw new BadRequestException("Email and OTP are required");
            }

            const result = await this.readerRepository.query(
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

            const updated = await this.readerRepository.query(
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