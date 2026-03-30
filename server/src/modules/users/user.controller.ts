import { Body, Controller, Delete, Param, Post, Put, Response, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserService } from "./user.service";
import { UserDto } from "./dto/user.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("users")
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Post("create")
    @UseInterceptors(FileInterceptor("profilePicture"))
    async registerUser(
        @Body() dto: UserDto,
        @UploadedFile() file?: any
    ) {
        return await this.userService.register(dto, file);
    }

    @Post("login")
    async loginUser(@Body() dto: LoginDto, @Response({ passthrough: true }) res: any) {
        return await this.userService.login(dto, res);
    }

    @Post("logout")
    @UseGuards(AuthGuard("jwt"))
    async logoutUser(@Response({ passthrough: true }) res: any) {
        return await this.userService.logout(res);
    }

    @Put("update/:userId")
    @UseGuards(AuthGuard("jwt"))
    @UseInterceptors(FileInterceptor("profilePicture"))
    async updateUser(
        @Param("userId") id: string,
        @Body() dto: UpdateUserDto,
        @UploadedFile() file?: any
    ) {
        return await this.userService.update(id, dto, file);
    }

    @Post("verify")
    async verifyUser(@Body() dto: { email: string, otp: string }) {
        return await this.userService.verifyMail(dto.email, dto.otp);
    }

    @Post("resend")
    async resendEmail(@Body() dto: { email: string }) {
        return await this.userService.resend(dto.email);
    }

    @Delete("delete/:userId")
    @UseGuards(AuthGuard("jwt"))
    async deleteUser(
        @Param("userId") id: any,
        @Body() password: string
    ) {
        return await this.userService.delete(id, password);
    }


}
