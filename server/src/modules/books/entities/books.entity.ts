import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    DeleteDateColumn
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Review } from "../../reviews/entities/review.entity";

export type BookImage = {
    url: string;
    publicId: string;
};

@Entity("books")
export class Book {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column({
        type: "jsonb",
        default: () => "'[]'"
    })
    images: BookImage[];

    @Column("text")
    description: string;

    @Column()
    genre: string;

    @Column({ type: "date", nullable: true })
    releaseDate: string;

    @Column("text", { array: true, default: [] })
    purchaseLinks: string[];

    @Column({ type: "uuid" })
    authorId: string;

    @ManyToOne(() => User, (user) => user.books, {
        onDelete: "CASCADE",
        onUpdate: "RESTRICT"
    })
    @JoinColumn({ name: "authorId" })
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

    @Column({
        default: false
    })
    isAdvertised: boolean

    @Column({nullable: true})
    trial: string

    @OneToMany(() => Review, (reviews) => reviews.book)
    reviews: Review[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
