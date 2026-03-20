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
export class AuthorEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({length: 50})
    name: string

    @Column({unique: true, length: 50})
    @Index()
    penName: string;

    @Column({unique: true, length: 100})
    email: string;
    
    @Column()
    password: string;

    @Column({nullable:true, type:"text"})
    bio: string

    @Column({type:"simple-array", nullable:true})
    interests: string[]

    @Column({nullable:true})
    profilePicture: string;

    @Column({type:"simple-array", nullable:true})
    socialLinks: string[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}