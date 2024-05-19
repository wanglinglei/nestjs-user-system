import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Group } from '../../group/entities/group.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  uid: number;

  @Column({ nullable: false, comment: '用户名' })
  username: string;

  @Column({ select: false, comment: '密码' })
  password: string;

  @Column({ comment: '昵称', nullable: true, default: '' })
  nickname: string;

  @Column({ comment: '头像', nullable: true })
  avatar: string;

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  updateTime: Date;

  @Column({ type: 'timestamp', comment: '登录时间', nullable: true })
  loginTime: Date;

  @ManyToMany(() => Group, (group) => group.users, { nullable: true })
  @JoinTable()
  groups: Group[];
}
