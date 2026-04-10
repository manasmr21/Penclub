import {
    BadRequestException,
    HttpException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Readlist } from "./entities/readlist.entity";
import { Book } from "../books/entities/books.entity";
import { CreateReadlistDto } from "./dto/create-readlist.dto";
import { UpdateReadlistDto } from "./dto/update-readlist.dto";

@Injectable()
export class ReadlistService {
    constructor(
        @InjectRepository(Readlist)
        private readlistRepository: Repository<Readlist>,
        @InjectRepository(Book)
        private bookRepository: Repository<Book>,
        private dataSource: DataSource
    ) { }

    async createReadlist(dto: CreateReadlistDto, userId: string) {
        try {
            if (!dto.name?.trim()) throw new BadRequestException({
                success: false,
                message: "Readlist name is required"
            });

            const readlist = this.readlistRepository.create({
                name: dto.name.trim(),
                isPublic: dto.isPublic ?? false,
                userId
            });

            const saved = await this.readlistRepository.save(readlist);

            return {
                success: true,
                message: "Readlist created successfully",
                readlist: saved
            };
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async getMyReadlists(userId: string) {
        try {
            const readlists = await this.readlistRepository.find({
                where: { userId },
                order: { createdAt: "DESC" },
                select: ["id", "name", "isPublic", "booksId", "createdAt", "updatedAt"]
            });

            return {
                success: true,
                readlists: readlists.map(r => ({
                    id: r.id,
                    name: r.name,
                    isPublic: r.isPublic,
                    count: r.booksId.length,
                    createdAt: r.createdAt,
                    updatedAt: r.updatedAt
                }))
            };
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async getReadlistById(id: string, userId?: string) {
        try {
            // Allow access if owner OR if the readlist is public
            const readlist = await this.readlistRepository
                .createQueryBuilder("readlist")
                .where("readlist.id = :id", { id })
                .andWhere("(readlist.userId = :userId OR readlist.isPublic = true)", { userId: userId ?? "" })
                .getOne();

            if (!readlist) throw new NotFoundException({
                success: false,
                message: "Readlist not found"
            });

            // Fetch books in a single query using ANY — no loop, no N+1
            let books: Book[] = [];
            if (readlist.booksId.length) {
                books = await this.bookRepository
                    .createQueryBuilder("book")
                    .where("book.id = ANY(:ids)", { ids: readlist.booksId })
                    .andWhere("book.approved = true")
                    .select([
                        "book.id",
                        "book.title",
                        "book.description",
                        "book.genre",
                        "book.images",
                        "book.authorId",
                        "book.releaseDate"
                    ])
                    .getMany();
            }

            return {
                success: true,
                message: "Readlist fetched successfully",
                readlist: {
                    id: readlist.id,
                    name: readlist.name,
                    isPublic: readlist.isPublic,
                    userId: readlist.userId,
                    count: readlist.booksId.length,
                    books,
                    createdAt: readlist.createdAt,
                    updatedAt: readlist.updatedAt
                }
            };
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async getUserReadlists(targetUserId: string) {
        try {
            const readlists = await this.readlistRepository.find({
                where: { userId: targetUserId, isPublic: true },
                order: { createdAt: "DESC" },
                select: ["id", "name", "booksId", "createdAt", "updatedAt"]
            });

            return {
                success: true,
                readlists: readlists.map(r => ({
                    id: r.id,
                    name: r.name,
                    count: r.booksId.length,
                    createdAt: r.createdAt,
                    updatedAt: r.updatedAt
                }))
            };
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async toggleBook(readlistId: string, bookId: string, userId: string) {
        try {
            // Single query: check → add/remove → return result, all in one round-trip.
            // RETURNING evaluates AFTER the update, so:
            //   - book was added   → array_position returns non-null  → added = true
            //   - book was removed → array_position returns null       → added = false
            const result = await this.dataSource.query(
                `UPDATE readlists
                 SET "booksId" = CASE
                     WHEN $1 = ANY("booksId") THEN array_remove("booksId", $1)
                     ELSE array_append("booksId", $1)
                 END
                 WHERE id = $2 AND "userId" = $3
                 RETURNING (array_position("booksId", $1) IS NOT NULL) as added`,
                [bookId, readlistId, userId]
            );

            if (!result.length) throw new NotFoundException({
                success: false,
                message: "Readlist not found or you are not the owner"
            });

            const added: boolean = result[0].added;

            return {
                success: true,
                added,
                message: added ? "Book added to readlist" : "Book removed from readlist"
            };
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async updateReadlist(id: string, dto: UpdateReadlistDto, userId: string) {
        try {
            if (!dto.name && dto.isPublic === undefined) throw new BadRequestException({
                success: false,
                message: "Nothing to update"
            });

            const update: Partial<Readlist> = {};
            if (dto.name !== undefined) update.name = dto.name.trim();
            if (dto.isPublic !== undefined) update.isPublic = dto.isPublic;

            const result = await this.readlistRepository.update(
                { id, userId },
                update
            );

            if (result.affected === 0) throw new NotFoundException({
                success: false,
                message: "Readlist not found or you are not the owner"
            });

            return { success: true, message: "Readlist updated successfully" };
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async deleteReadlist(id: string, userId: string) {
        try {
            const result = await this.readlistRepository.delete({ id, userId });

            if (result.affected === 0) throw new NotFoundException({
                success: false,
                message: "Readlist not found or you are not the owner"
            });

            return { success: true, message: "Readlist deleted successfully" };
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    private handleServiceError(error: unknown): never {
        if (error instanceof HttpException) throw error;
        console.error(error);
        throw new InternalServerErrorException({
            success: false,
            message: "Internal server error"
        });
    }
}
