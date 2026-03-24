import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index
} from "typeorm";

@Entity()
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

    @Column({ nullable: true })
    otpHash: string

    @Column({ type: "timestamptz", nullable: true })
    otpExpiresAt: Date;

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

