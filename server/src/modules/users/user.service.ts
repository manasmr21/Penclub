import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    HttpException,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";
import { User } from "./entities/user.entity";
import { UserDto } from "./dto/user.dto";
import { MailService } from "../../utils/sendMails";
import { CloudinaryService } from "../../utils/cloudinary/cloudinary.service";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { randomBytes } from "crypto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private mailService: MailService,
        private cloudinaryService: CloudinaryService,
        private jwtService: JwtService
    ) { }

    private generateOtp(): string {
        return randomInt(100000, 1000000).toString();
    }

    private async sendMail(email: string, subject: string, message: string) {
        try {

            await this.mailService.sendMailService(
                email,
                subject,
                message
            );

            return {
                success: true,
                message: "OTP sent successfully"
            }

        } catch (error) {
            return error
        }
    }

    async register(dto: UserDto, file?: any) {
        try {
            const { name, email, username, password, role } = dto;

            if (!name || !email || !password || !role || !username) {
                throw new BadRequestException({
                    success: false,
                    message: "All fields are required"
                });
            }


            if (file) {
                const folder = "users";
                const organization = "penclub";
                const cloudinaryResponse = await this.cloudinaryService.uploadImage(file, organization, folder);
                var profilePicture = cloudinaryResponse.secure_url;
                var profilePictureId = cloudinaryResponse.public_id;
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const otp = this.generateOtp();
            const otpHash = await bcrypt.hash(otp, 10);
            const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

            const newUser = this.userRepository.create({
                name,
                email,
                username: username,
                password: hashedPassword,
                role: role,
                bio: dto.bio,
                interests: dto.interest,
                socialLinks: dto.socialeLinks,
                profilePicture,
                profilePictureId,
                otpHash,
                otpExpiresAt,
                isEmailVerified: false
            });

            const createdUser = await this.userRepository.save(newUser);

            await this.sendMail(email, "Verify your account", `Your OTP is ${otp}. It expires in 10 minutes.`);

            return {
                success: true,
                message: "OTP sent to your email.",
                user: {
                    id: createdUser.id,
                    email: createdUser.email,
                    username: createdUser.username,
                    role: createdUser.role,
                    profilePicture: createdUser.profilePicture ?? undefined,
                    socialLinks: createdUser.socialLinks ?? undefined,
                    interests: createdUser.interests ?? undefined,
                    bio: createdUser.bio ?? undefined
                },
                otpExpiresInMinutes: 10
            };
        } catch (error) {

            if (error.code === '23505') {
                const detail = error.detail;

                if (detail.includes('email')) {
                    throw new ConflictException("Email already exists");
                }

                if (detail.includes('penName')) {
                    throw new ConflictException("Pen name already exists");
                }

                throw new ConflictException("Duplicate entry");
            }

            throw this.handleServiceError(error);
        }
    }

    async update(id: string, dto: UpdateUserDto, file?: any) {
        try {

            const user = await this.userRepository.findOne({
                where: {
                    id
                }
            })

            if (!user) throw new NotFoundException({
                success: false,
                message: "User not found."
            })

            if (file) {
                if (!dto.profilePictureId) throw new NotFoundException({
                    success: false,
                    message: "Profile picture public_id not found."
                })

                if (user.profilePicture && user.profilePictureId) await this.cloudinaryService.deleteImage(dto.profilePictureId)

                const organization = "penclub"
                const folder = "users"

                const cloudinaryResponse = await this.cloudinaryService.uploadImage(file, organization, folder)

                user.profilePicture = cloudinaryResponse.secure_url
                user.profilePictureId = cloudinaryResponse.public_id
            }

            const updatedUser = this.userRepository.merge(user, dto);

            await this.userRepository.save(updatedUser)

            return {
                success: true,
                message: "User update successfully"
            }

        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async login(dto: LoginDto, res: any) {
        try {

            const identifier =
                dto.identifier ??
                (dto as any).email ??
                (dto as any).username;

            if (!identifier || !dto.password) throw new BadRequestException({
                success: false,
                message: "All fields are required"
            })

            const user = await this.userRepository.findOne({
                where: [
                    { email: identifier },
                    { username: identifier }
                ]
            })

            if (!user) throw new UnauthorizedException({
                success: false,
                message: "User not found"
            })

            const isValidPassword = await bcrypt.compare(dto.password, user.password);

            if (!isValidPassword) throw new UnauthorizedException({
                success: false,
                message: "Invalid credentials"
            })

            user.isLoggedIn = true;
            await this.userRepository.save(user);

            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isLoggedIn: user.isLoggedIn
            }

            const token = this.jwtService.sign(payload);

            res.cookie("user", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax"
            }
            )
            return {
                success: true,
                message: "User logged in successfully",
                user: {
                   id: user.id,
                   name: user.name,
                   email: user.email,
                   username: user.username,
                   followersCount: user.role === "author" ? user.followersCount : undefined,
                   followingCount: user.followingCount,
                   role: user.role,
                   bio: user.bio ?? undefined,
                   interests: user.interests ?? undefined,
                   socialLinks: user.socialLinks ?? undefined,
                   profilePicture: user.profilePicture ?? undefined,
                   isEmailVerified: user.isEmailVerified,
                   profilePictureId: user.profilePictureId ?? undefined
                }
            }

        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async logout(res: any, req: any) {
        try {

            const userId = req.user?.id;

            if (!userId) throw new UnauthorizedException({
                success: false,
                message: "Unauthorized user"
            })

            const user = await this.userRepository.findOne({
                where: {
                    id: userId
                }
            })

            if(!user) throw new NotFoundException({
                success: false,
                message: "User not found"
            })

            user.isLoggedIn = false;
            await this.userRepository.save(user);

            res.clearCookie("user", {
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

    async delete(id: any, password: string) {
        try {

            const user = await this.userRepository.findOne({
                where: {
                    id
                }
            })

            if (!user) throw new NotFoundException({
                success: false,
                message: "User not found"
            })

            const isValidPassword = bcrypt.compare(password, user.password);

            if (!isValidPassword) throw new UnauthorizedException({
                success: false,
                message: "Unauthorized user"
            })

            await this.userRepository.delete(id);

            return {
                success: true,
                message: "User deleted successfully"
            }

        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async verifyMail(email: string, otp: string) {
        try {

            const otpValue = String(otp ?? "").trim();

            if (!email || !otpValue) throw new BadRequestException(
                {
                    success: false,
                    message: "Email and otp both are required"
                }
            )

            const user = await this.userRepository.findOne({
                where: {
                    email
                }
            })

            if (!user) throw new NotFoundException({
                success: false,
                message: "User not found"
            })

            if (!user.otpHash || !user.otpExpiresAt) throw new UnauthorizedException({
                success: false,
                message: "OTP expired or not requested"
            })

            if (user.otpExpiresAt < new Date()) {
                user.otpHash = null
                user.otpExpiresAt = null
                await this.userRepository.save(user);
                throw new UnauthorizedException({
                    success: false,
                    message: "OTP expired"
                })
            }

            const isValidOtp = await bcrypt.compare(otpValue, user.otpHash);

            if (!isValidOtp) throw new UnauthorizedException({
                success: false,
                message: "Invalid otp"
            })

            if (!user.isEmailVerified) user.isEmailVerified = true

            user.otpExpiresAt = null
            user.otpHash = null

            await this.userRepository.save(user);

            return {
                success: true,
                message: "Otp verified."
            }

        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async resend(email: string) {
        try {

            const otp = this.generateOtp()

            const user = await this.userRepository.findOne({
                where: {
                    email
                }
            })

            if (!user) throw new NotFoundException({
                success: false,
                message: "User not found"
            })

            user.otpHash = await bcrypt.hash(otp, 12)
            user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

            await this.userRepository.save(user);

            await this.mailService.sendMailService(
                email,
                "Verify your account",
                `Your OTP is ${otp}. It expires in 10 minutes.`
            );



            return {
                success: true,
                message: "Otp sent successfully"
            }


        } catch (error) {
            throw this.handleServiceError(error);
        }

    }

    async forgotPassword(email: string) {
        try {
            const normalizedEmail = String(email ?? "").trim().toLowerCase();

            if (!normalizedEmail) throw new BadRequestException({
                success: false,
                message: "Email is required"
            })

            const user = await this.userRepository.findOne({
                where: {
                    email: normalizedEmail
                }
            })

            if (!user) throw new NotFoundException({
                success: false,
                message: "User not found"
            })

            const rawToken = randomBytes(32).toString("hex");
            const hashedToken = await bcrypt.hash(rawToken, 12);
            const tokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

            user.resetToken = hashedToken;
            user.resetTokenExpiresAt = tokenExpiresAt;

            const resetLink = `${process.env.FRONTEND_URL}/reset-password?userId=${user.id}&token=${encodeURIComponent(rawToken)}`;
            await this.userRepository.save(user);

            await this.mailService.sendMailService(
                normalizedEmail,
                "Password Reset Request",
                `You requested a password reset. Click the link to reset your password: ${resetLink}. This link expires in 1 hour.`
            );


            return {
                success: true,
                message: "Password reset token generated. Please check your email."
            }

        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async resetPassword(userId: string, token: string, newPassword: string) {
        try {
            const normalizedUserId = String(userId ?? "").trim();
            const normalizedToken = String(token ?? "").trim();
            const normalizedPassword = String(newPassword ?? "");

            if (!normalizedUserId || !normalizedToken || !normalizedPassword) {
                throw new BadRequestException({
                    success: false,
                    message: "User id, token and new password are required"
                })
            }

            if (normalizedPassword.length < 6) {
                throw new BadRequestException({
                    success: false,
                    message: "Password must be at least 6 characters"
                })
            }

            const user = await this.userRepository.findOne({
                where: {
                    id: normalizedUserId
                }
            })

            if (!user) throw new NotFoundException({
                success: false,
                message: "User not found"
            })

            if (!user.resetToken || !user.resetTokenExpiresAt) throw new UnauthorizedException({
                success: false,
                message: "Invalid or expired reset token"
            })

            if (user.resetTokenExpiresAt < new Date()) {
                user.resetToken = null;
                user.resetTokenExpiresAt = null;
                await this.userRepository.save(user);
                throw new UnauthorizedException({
                    success: false,
                    message: "Reset token expired"
                })
            }

            const isValidToken = await bcrypt.compare(normalizedToken, user.resetToken);

            if (!isValidToken) throw new UnauthorizedException({
                success: false,
                message: "Invalid reset token"
            })

            const newHashedPassword = await bcrypt.hash(normalizedPassword, 12);

            user.password = newHashedPassword;
            user.resetToken = null;
            user.resetTokenExpiresAt = null;

            await this.userRepository.save(user);

            return {
                success: true,
                message: "Password reset successfully"
            }
        } catch (error) {
            throw this.handleServiceError(error);
        }

    }

    //Error handler - to maker sure that errors does not make my server crash
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
