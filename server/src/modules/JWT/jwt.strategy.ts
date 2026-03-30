import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Request } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        config: ConfigService
    ) {
        const secret =
            config.get<string>("JWT_SECRETE") ??
            config.get<string>("JWT_SECRET");
        if (!secret) {
            throw new NotFoundException("JWT_SECRETE/JWT_SECRET is not configured");
        }
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([

                (req: Request) => req?.cookies?.user,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: secret
        });



    }
    async validate(jwtPayload: any) {
        const userId = jwtPayload.id ?? jwtPayload.sub;

        const user = await this.userRepository.findOne({
            where: {
                id: userId
            },
            select:[
                "id",
                "role",
                "isEmailVerified"
            ]
        });

        if (!user) {
            throw new UnauthorizedException("User no longer exists");
        }

        if (!user.isEmailVerified) {
            throw new UnauthorizedException("Email not verified");
        }

        return user
    }
}
