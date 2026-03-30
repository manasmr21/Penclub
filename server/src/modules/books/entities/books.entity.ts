import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToMany
} from "typeorm";
import { AuthorEntity } from "../../author/entities/author.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Review } from "src/modules/reviews/entities/review.entity";

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

    @ManyToOne(() => User, {
        onDelete: "CASCADE",
        onUpdate: "RESTRICT"
    })
    @JoinColumn({name: "books_by_authors"})
    author: AuthorEntity;

    @OneToMany(()=> Review, (reviews)=> reviews.book)
    reviews: Review[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
