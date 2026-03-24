import { BadRequestException, Body, Controller, Delete, Param, Post, Put, Res } from "@nestjs/common";
import { ReaderService } from "./reader.service";
import { ReaderDto } from "./dto/reader.dto";
import { VerifyOtpDto } from "../author/dto/verify-otp.dto";
import type { Response } from "express";

@Controller("readers")
export class ReaderController {
    constructor(
        private readerService: ReaderService
    ) {}

    @Post("register")
    async register(
        @Body() dto: ReaderDto,
        @Res({ passthrough: true }) res: Response
    ) {
        return await this.readerService.readerRegister(dto, res);
    }

    @Post("login")
    async login(
        @Body() credentials: { email?: string, username?: string, identifier?: string, password: string },
        @Res({ passthrough: true }) res: Response
    ) {
        const identifier = credentials.email ?? credentials.username ?? credentials.identifier;
        if (!identifier) {
            throw new BadRequestException("Email or username is required");
        }

        return await this.readerService.readerLogin(identifier, credentials.password, res);
    }

    @Post("logout")
    async logout(@Res({ passthrough: true }) res: Response) {
        return await this.readerService.logout(res);
    }

    @Post("verify-email")
    async verifyEmail(@Body() dto: VerifyOtpDto) {
        return await this.readerService.verifyEmail(dto);
    }

    @Post("verify-otp-only")
    async verifyOtpOnly(@Body() dto: VerifyOtpDto) {
        return await this.readerService.verifyOtpOnly(dto);
    }

    @Put("update/:readerId")
    async updateReader(
        @Param("readerId") id: any,
        @Body() dto: Partial<ReaderDto>
    ) {
        return await this.readerService.updateProfile(id, dto);
    }

    @Delete("delete/:readerId")
    async deleteReader(@Param("readerId") id: any) {
        return await this.readerService.deleteReader(id);
    }
}
