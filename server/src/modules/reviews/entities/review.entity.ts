import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    JoinColumn,
    Unique
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Book } from "src/modules/books/entities/books.entity";

@Entity("reviews")
@Unique(["userId", "bookId"])
export class Review {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("int", { width: 1 })
    rating: number;

    @Column("text", { nullable: true })
    content?: string;

    @Index()
    @Column({ type: "uuid" })
    bookId: string

    @Index()
    @Column({ type: "uuid" })
    userId: string

    @ManyToOne(() => Book, { onDelete: "CASCADE" })
    @JoinColumn({ name: "review_of_book" })
    book: Book;

    @ManyToOne(() => User, (user) => user.review, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
