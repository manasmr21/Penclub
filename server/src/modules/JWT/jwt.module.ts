import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { JwtStrategy } from "./jwt.strategy";

@Module({

    imports: [
        PassportModule.register({ defaultStrategy: "jwt" }),
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>("JWT_SECRETE") ?? config.get<string>("JWT_SECRET"),
                signOptions: { expiresIn: "1d" }
            })
        })
    ],
    providers: [JwtStrategy],
    exports: [JwtModule, PassportModule]
})
export class JwtAuthModule { };
