import {
    HttpException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Like } from "./entities/like.entity";
import { Book } from "../books/entities/books.entity";
import { Blog } from "../blog/entities/blogs.entity";

@Injectable()
export class LikesService {
    constructor(
        @InjectRepository(Like)
        private likesRepository: Repository<Like>,
        private dataSource: DataSource
    ) { }

    async toggleBookLike(bookId: string, userId: string) {
        return this.toggle(userId, bookId, "book");
    }

    async toggleBlogLike(blogId: string, userId: string) {
        return this.toggle(userId, blogId, "blog");
    }

    async getBookLikeStatus(bookId: string, userId: string) {
        try {
            const liked = await this.likesRepository.existsBy({ userId, targetId: bookId, targetType: "book" });
            return { success: true, liked };
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    async getBlogLikeStatus(blogId: string, userId: string) {
        try {
            const liked = await this.likesRepository.existsBy({ userId, targetId: blogId, targetType: "blog" });
            return { success: true, liked };
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    private async toggle(userId: string, targetId: string, targetType: "book" | "blog") {
        const qr = this.dataSource.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();

        try {
            // Attempt insert — ON CONFLICT DO NOTHING means if the like already exists,
            // no row is inserted and raw will be empty (unlike). Otherwise it's a new like.
            const insert = await qr.manager
                .createQueryBuilder()
                .insert()
                .into(Like)
                .values({ userId, targetId, targetType })
                .orIgnore()
                .execute();

            const liked = insert.raw.length > 0;
            const entity = targetType === "book" ? Book : Blog;

            if (liked) {
                // New like — increment counter
                await qr.manager
                    .createQueryBuilder()
                    .update(entity)
                    .set({ likesCount: () => '"likesCount" + 1' })
                    .where("id = :id", { id: targetId })
                    .execute();
            } else {
                // Already liked — delete the row and decrement.
                // GREATEST prevents going below 0 if counter ever drifts.
                await qr.manager.delete(Like, { userId, targetId, targetType });
                await qr.manager
                    .createQueryBuilder()
                    .update(entity)
                    .set({ likesCount: () => 'GREATEST("likesCount" - 1, 0)' })
                    .where("id = :id", { id: targetId })
                    .execute();
            }

            await qr.commitTransaction();

            return {
                success: true,
                liked,
                message: liked ? "Liked successfully" : "Unliked successfully"
            };
        } catch (error) {
            await qr.rollbackTransaction();
            this.handleServiceError(error);
        } finally {
            await qr.release();
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
