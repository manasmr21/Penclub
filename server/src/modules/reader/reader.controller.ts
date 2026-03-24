import { Body, Controller, Post, Res } from "@nestjs/common";
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
    async register(@Body() dto: ReaderDto) {
        return await this.readerService.readerRegister(dto);
    }

    @Post("verify-otp")
    async verifyOtp(
        @Body() dto: VerifyOtpDto,
        @Res({ passthrough: true }) res: Response
    ) {
        return await this.readerService.verifyOtp(dto, res);
    }
}
