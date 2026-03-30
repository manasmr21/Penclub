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
import { Blog } from "../../blog/entities/blogs.entity";
import { User } from "../../users/entities/user.entity";

@Entity("reviews")
@Unique(["userId", "blogId"])
export class Review {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("int", { width: 1 })
    rating: number; // 1-5

    @Column("text", { nullable: true })
    content?: string;

    @Column({ type: "uuid" })
    blogId: string


    @Index()
    @Column({ type: "uuid" })
    userId: string

    @Index()
    @ManyToOne(() => Blog, { onDelete: "CASCADE" })
    @JoinColumn({ name: "blogId" })
    blog: Blog;

    @ManyToOne(() => User, (user) => user.review, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
