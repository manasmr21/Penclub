import { Blog } from "src/modules/blog/entities/blogs.entity";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index
} from "typeorm";

@Entity("authors")
export class AuthorEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ length: 50 })
    name: string

    @Column({ unique: true, length: 50 })
    @Index()
    penName: string;

    @Column({ unique: true, length: 100 })
    @Index()
    email: string;

    @Column()
    password: string;

    @Column({
        default: "author",
        enum: ["reader", "author", "admin"]
    })
    role: string

    @OneToMany(()=> Blog, (blog)=> blog.author)
    blogs: Blog[]

    @Column({ nullable: true })
    otpHash: string;

    @Column({ type: "timestamptz", nullable: true })
    otpExpiresAt: Date;

    @Column({ default: false })
    isEmailVerified: boolean;

    @Column({ nullable: true, type: "text" })
    bio: string

    @Column({ type: "simple-array", nullable: true })
    interests: string[]

    @Column({ nullable: true })
    profilePicture: string;

    @Column({ type: "simple-array", nullable: true })
    socialLinks: string[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
