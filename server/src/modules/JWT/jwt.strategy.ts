import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Request } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {
        const secret = process.env.JWT_SECRETE_KEY;
        if (!secret) {
            throw new NotFoundException("JWT_SECRETE_KEY is not configured");
        }
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([

                (req: Request) => req?.cookies?.access_token,
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
