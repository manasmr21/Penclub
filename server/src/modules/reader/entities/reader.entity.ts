import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index
} from "typeorm";

@Entity("readers")
@Index(['username'])
export class Reader {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: "varchar", nullable: true })
    otpHash: string | null

    @Column({ type: "timestamptz", nullable: true })
    otpExpiresAt: Date | null;

    @Column({ default: false })
    isEmailVerified: boolean;

    @Column({ type: "simple-array", nullable: true })
    interest?: string[];

    @Column({ nullable: true })
    profile?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

