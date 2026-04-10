import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index
} from "typeorm";

@Entity("publishers")
export class Publisher {
  @Index()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string

  @Index()
  @Column({ unique: true })
  publisherId: string

  @Column({ unique: true })
  email: string

  @Column()
  number: string

  @Column()
  logo: string

  @Column()
  logoId: string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
