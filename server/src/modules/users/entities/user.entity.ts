import { Book } from "../../books/entities/books.entity";
import { Blog } from "../../blog/entities/blogs.entity";
import { Comment } from "../../comments/entities/comment.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  Index
} from "typeorm";
import { Review } from "src/modules/reviews/entities/review.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ unique: true })
  @Index()
  username: string;

  @Column()
  password: string;

  @Column({
    default: "reader",
    enum: ["reader", "author", "admin"],
    enumName: "user_roles_enum"
  })
  role: string;

  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];

  @Column({ nullable: true, type: "text" })
  bio?: string;

  @OneToMany(() => Book, (book) => book.author)
  books: Book[]

  @ManyToMany(() => User)
  @JoinTable({ name: "users_following" })
  following: User[];

  @ManyToMany(() => User, (user) => user.following)
  followers: User[];

  @Column({ default: 0 })
  followersCount: number;

  @Column({ default: 0 })
  followingCount: number;

  @Column({ type: "text", nullable: true })
  otpHash?: string | null;

  @Column({ type: "timestamptz", nullable: true })
  otpExpiresAt?: Date | null;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: "simple-array", nullable: true })
  interests?: string[];

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ nullable: true })
  profilePictureId?: string;

  @Column({ type: "simple-array", nullable: true })
  socialLinks?: string[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(()=>Review, (review)=> review.user)
  review: Review[]

  @Column({ type: "text", nullable: true })
  resetToken?: string | null;

  @Column({type: "timestamptz", nullable: true})
  resetTokenExpiresAt?: Date | null;

  @Column({ default: false })
  isLoggedIn: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
