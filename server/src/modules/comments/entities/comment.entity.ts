import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    JoinColumn,
    DeleteDateColumn
} from "typeorm";
import { Blog } from "../../blog/entities/blogs.entity";
import { User } from "../../users/entities/user.entity";

@Entity("comments")
export class Comment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text")
    content: string;

    @Index()
    @ManyToOne(() => Blog, {
        onDelete: "CASCADE",
        onUpdate: "RESTRICT"
    })
    @JoinColumn({ name: "blogId" })
    blog: Blog;

    @ManyToOne(() => User, (user) => user.comments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => Comment, (comment) => comment.replies, {
        nullable: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "parentId" })
    parent?: Comment | null;

    @OneToMany(() => Comment, (replies) => replies.parent)
    replies: Comment[];

    @Column({ type: "uuid" })
    blogId: string;

    @Column({ type: "uuid" })
    userId: string;

    @Column({ type: "uuid", nullable: true })
    parentId?: string | null;

    @Column({default:false})
    edited: Boolean

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
