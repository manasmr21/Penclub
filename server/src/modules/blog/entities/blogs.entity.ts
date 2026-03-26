import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne
} from "typeorm";
import { AuthorEntity } from "src/modules/author/entities/author.entity";

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

  @ManyToOne(() => AuthorEntity, (author) => author.blogs, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT"
  })
  author: AuthorEntity;

  @Column({
    enum:["posted", "pending", "draft", "deleted", "edited"],
  })
  status: string

  @Column({ default: 0 })
  likesCount: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}