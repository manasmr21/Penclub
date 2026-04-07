import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne,
  DeleteDateColumn
} from "typeorm";
import { AuthorEntity } from "../../author/entities/author.entity";
import { User } from "../../users/entities/user.entity";

@Entity("blogs")
export class Blog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column("text")
  content: string;

  @Column("text", { array: true, default: [] })
  tags: string[];

  @Column({ nullable: true })
  coverImage: string ;

  @Column({ nullable: true })
  coverImageId: string;

  @Column({type: "uuid"})
  userId: string

  @ManyToOne(() => User, (user) => user.blogs, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT"
  })
  user: User;

  @Column({
    enum:["posted", "pending", "draft", "deleted", "edited"],
  })
  status: string

  @Column({ default: 0 })
  likesCount: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
