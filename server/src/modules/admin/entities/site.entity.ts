import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from "typeorm";

@Entity("site_settings")
export class Site {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "simple-array", nullable: true })
  navbar?: string[];

  @Column({ type: "simple-array", nullable: true })
  roles?: string[];

  @Column({ type: "simple-array", nullable: true })
  rolepermissions?: string[];

  @Column({ type: "simple-array", nullable: true })
  genre?: string[];

  @Column({ nullable: true })
  logo?: string;

  @Column({ nullable: true })
  logoId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
