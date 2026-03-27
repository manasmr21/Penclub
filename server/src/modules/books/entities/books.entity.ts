import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { AuthorEntity } from "src/modules/author/entities/author.entity";

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

    @ManyToOne(() => AuthorEntity, {
        onDelete: "CASCADE",
        onUpdate: "RESTRICT"
    })
    author: AuthorEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
