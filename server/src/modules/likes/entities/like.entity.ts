import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Unique,
    Index
} from "typeorm";

@Entity("likes")
@Unique(["userId", "targetId", "targetType"])
@Index(["targetId", "targetType"])
export class Like {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "uuid" })
    userId: string;

    @Column({ type: "uuid" })
    targetId: string;

    @Column({ enum: ["book", "blog"] })
    targetType: string;

    @CreateDateColumn()
    createdAt: Date;
}
