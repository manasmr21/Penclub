import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    DeleteDateColumn
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Review } from "../../reviews/entities/review.entity";

@Entity("books")
export class Book {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    coverImage: string;

    @Column({ nullable: true })
    coverImageId: string;

    @Column("text")
    description: string;

    @Column()
    genre: string;

    @Column({ type: "date", nullable: true })
    releaseDate: string;

    @Column("text", { array: true, default: [] })
    purchaseLinks: string[];

    @Column()
    authorId: string;

    @ManyToOne(() => User, {
        onDelete: "CASCADE",
        onUpdate: "RESTRICT"
    })
    author: User;

    @Column({
        default: "pending",
        enum: ["pending", "approved", "not_approved"]
    })
    state: string

    @Column({
        default: false
    })
    approved: boolean

    @OneToMany(()=> Review, (reviews)=> reviews.book)
    reviews: Review[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
