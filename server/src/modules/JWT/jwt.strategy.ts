import { Injectable, NotFoundException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor() {
        const secret = process.env.JWT_SECRETE_KEY;
        if (!secret) {
            throw new NotFoundException("JWT_SECRETE_KEY is not configured");
        }
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([

                (req: Request) => req?.cookies?.access_token
            ]),
            secretOrKey: secret
        });
    }
    async validate(payload: any) {
        return {
            admin_id: payload.sub,
            email: payload.email
        }
    }
}
