import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { MailModule } from "../../utils/mail.module";
import { CloudinaryModule } from "../../utils/cloudinary/cloudinary.module";
import { JwtAuthModule } from "../JWT/jwt.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        MailModule,
        CloudinaryModule,
        JwtAuthModule
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}
