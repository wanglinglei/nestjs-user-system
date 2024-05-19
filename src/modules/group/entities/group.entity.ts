import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
@Entity()
export class Group {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ comment: '团队名称' })
  groupname: string;

  @Column({ comment: '团队描述', nullable: true })
  description: string;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;

  @ManyToMany(() => User, (user) => user.groups, { nullable: true })
  @JoinTable()
  users: User[];
}
