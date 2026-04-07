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
import { User } from "../users/entities/user.entity";
import { MailService } from "../../utils/sendMails";
import { CloudinaryService } from "../../utils/cloudinary/cloudinary.service";
import { JwtService } from "@nestjs/jwt";
import { randomInt } from "crypto";
import { Book } from "../books/entities/books.entity";
import { Blog } from "../blog/entities/blogs.entity";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Book)
        private bookRepository: Repository<Book>,
        @InjectRepository(Blog)
        private blogRepository: Repository<Blog>,
        private mailService: MailService,
        private cloudinaryService: CloudinaryService,
        private jwtService: JwtService
    ) { }

    private generateOtp(): string {
        return randomInt(100000, 1000000).toString();
    }

    async getPendingbooks(req: any) {
        try {

            const userRole = req.user?.role

            if (userRole !== "admin") throw new UnauthorizedException({
                success: false,
                message: "You are not authorized."
            })

            const books = await this.bookRepository.find({
                where: {
                    approved: false
                }
            })

            if (books.length === 0) throw new NotFoundException({
                success: false,
                message: "No books found"
            })

            return {
                success: true,
                message: "Pending books fetched successfully",
                books
            }

        } catch (error) {
            throw this.handleServiceError(error);
        }
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

    private normalizeStringArray(value?: string | string[]) {
        if (Array.isArray(value)) {
            return value.map((item) => item.trim()).filter(Boolean);
        }

        if (typeof value === "string") {
            return value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);
        }

        return undefined;
    }

    async createAdmin(dto: { email: string, password: string, confirmPassword: string }) {
        try {

            const { email, password, confirmPassword } = dto;

            if (password !== confirmPassword) throw new BadRequestException({
                success: false,
                message: "Confirm password does not match the password"
            })

            if (!email || !password) throw new BadRequestException({
                success: false,
                message: "All fields are required"
            })

            const adminExist = await this.userRepository.findOne({
                where: {
                    role: "admin"
                }
            })

            if (adminExist) throw new BadRequestException({
                success: false,
                message: "Admin already exist cannot make another one"
            })

            const hashedPassword = await bcrypt.hash(password, 12);

            const admin = this.userRepository.create({
                email,
                password: hashedPassword,
                name: "Admin",
                username: "admin",
                role: "admin"
            })

            await this.userRepository.save(admin);

            return {
                success: true,
                message: "Admin created successfully",
                admin: {
                    username: admin.username,
                    email: admin.email,
                    role: admin.role
                }
            }

        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async loginAdmin(dto: { email: string, password: string }, res: any) {
        try {

            const { email, password } = dto;

            if (!email || !password) throw new BadRequestException({
                success: false,
                message: "All fields are required"
            })

            const admin = await this.userRepository.findOne({
                where: {
                    email,
                    role: "admin"
                }
            })

            if (!admin) throw new UnauthorizedException({
                success: false,
                message: "Admin not found"
            })

            const isValidPassword = await bcrypt.compare(password, admin.password);

            if (!isValidPassword) throw new UnauthorizedException({
                success: false,
                message: "Invalid credentials"
            })

            admin.isLoggedIn = true;
            await this.userRepository.save(admin);

            const payload = {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                isLoggedIn: admin.isLoggedIn
            }

            const token = this.jwtService.sign(payload);

            res.cookie("admin", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax"
            });

            return {
                success: true,
                message: "Admin logged in successfully",
                admin: {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email,
                    username: admin.username,
                    role: admin.role,
                    isLoggedIn: admin.isLoggedIn
                }
            }


        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async logoutAdmin(res: any, req: any) {
        try {
            const userId = req.user?.id;
            const role = req.user?.role;

            if (!userId) throw new UnauthorizedException({
                success: false,
                message: "Unauthorized user"
            })

            if (role !== "admin") throw new UnauthorizedException({
                success: false,
                message: "Only admins can access this route"
            })

            const admin = await this.userRepository.findOne({
                where: {
                    id: userId,
                    role: "admin"
                }
            })

            if (!admin) throw new NotFoundException({
                success: false,
                message: "Admin not found"
            })

            admin.isLoggedIn = false;
            await this.userRepository.save(admin);

            res.clearCookie("admin", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax"
            });

            return {
                success: true,
                message: "Admin logged out successfully"
            };
        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async approve(req: any, bookId: string, approve: boolean) {
        try {

            const userRole = req.user?.role
            const userId = req.user?.id

            const admin = await this.userRepository.createQueryBuilder("users")
                .where("users.id = :userId", { userId })
                .select([
                    "users.id",
                    "users.role"
                ])
                .getOne()


            if (userRole !== admin?.role) throw new UnauthorizedException({
                success: false,
                message: "Unauthorized"
            })

            if (userRole !== "admin") throw new UnauthorizedException({
                success: false,
                message: "You are not authorized"
            })


            const book = await this.bookRepository
                .createQueryBuilder("books")
                .where("books.id = :bookId", { bookId })
                .select([
                    "books.id",
                    "books.approved",
                    "books.state"
                ])
                .getOne();

            if (!book) throw new NotFoundException({
                success: false,
                message: "Book not found"
            })

            if (book.approved) throw new BadRequestException({
                success: false,
                message: "Book has already been approved"
            })

            if (approve) {
                book.approved = true
                book.state = "approved"
            } else {
                book.approved = false
                book.state = "not_approved"
            }

            await this.bookRepository.save(book);

            return {
                success: true,
                message: "Books approved",
                book
            }

        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async softDeleteUser(req: any, userId : string){
        try {

            const adminId = req.user?.id
            const userRole = req.user?.role

            if(userRole !== "admin") throw new UnauthorizedException({
                success: false,
                message: "You are not authorized"
            })

            //@ts-expect-error
            await this.userRepository.softDelete({id:userId?.userId});

            return{
                success:true,
                message: "User has been deleted temporarily"
            }

        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async permanentDelete(req: any, userId: string){
        try {

            const userRole = req.user?.role

            if(userRole !== "admin") throw new UnauthorizedException({
                success: false,
                message: "Your are not authorized"
            })

            //@ts-expect-error
            await this.userRepository.delete({id:userId.userId});


        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async softDeleteBlog(req: any, blogId: string) {
        try {

            const userRole = req.user?.role

            if (!blogId) throw new BadRequestException({
                success: false,
                message: "Blog id is required"
            })

            if (userRole !== "admin") throw new UnauthorizedException({
                success: false,
                message: "You are not authorized"
            })

            //@ts-expect-error
            const deletedBlog = await this.blogRepository.softDelete({id:blogId.blogId});

            if (deletedBlog.affected === 0) throw new NotFoundException({
                success: false,
                message: "Blog not found"
            })

            return {
                success: true,
                message: "Blog has been deleted temporarily"
            }

        } catch (error) {
            throw this.handleServiceError(error);
        }
    }

    async permanentDeleteBlog(req: any, blogId: string) {
        try {

            const userRole = req.user?.role

            if (!blogId) throw new BadRequestException({
                success: false,
                message: "Blog id is required"
            })

            if (userRole !== "admin") throw new UnauthorizedException({
                success: false,
                message: "You are not authorized"
            })

            const blog = await this.blogRepository.findOne({
                where: {
                    id: blogId
                },
                withDeleted: true
            })

            if (!blog) throw new NotFoundException({
                success: false,
                message: "Blog not found"
            })

            //@ts-expect-error
            await this.blogRepository.delete({id:blogId.blogId});

            let response = null;

            if (blog.coverImageId) {
                response = await this.cloudinaryService.deleteImage(blog.coverImageId);
            }

            return {
                success: true,
                message: "Blog has been deleted permanently",
                response
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
