import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository, Like, Equal, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Group } from '../group/entities/group.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const data = new User();
    data.username = createUserDto.username;
    data.password = createUserDto.password;

    return this.userRepository.save(data);
  }

  async findAll(query: { keyword: string; page: number; size: number }) {
    const data = await this.userRepository.find({
      where: {
        username: Like(`%${query.keyword}%`),
      },
      relations: ['groups'],
      order: {
        uid: 'ASC',
      },
      skip: (query.page - 1) * query.size,
      take: query.size,
    });
    const total = await this.userRepository.count({
      where: {
        username: Like(`%${query.keyword}%`),
      },
    });
    return {
      data,
      total,
    };
  }
  /**
   * @description: 根据用户id查询用户
   * @param {number} id
   * @return {*}
   */
  findOne(id: number) {
    return this.userRepository.findOneBy({
      uid: Equal(id),
    });
  }
  /**
   * @description: 根据用户名查询用户
   * @param {string} username
   * @return {*}
   */
  findOneByUsername(username: string) {
    return this.userRepository.findOneBy({
      username: Equal(username),
    });
  }

  update(uid: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(uid, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  async addGroup(params: { groups: string[]; uid: string }) {
    const { groups, uid } = params;
    const userInfo = await this.findOne(+uid);
    const userGroups = await this.groupRepository.findBy({ id: In(groups) });
    console.log('userGroups', userGroups);

    userInfo.groups = userGroups;
    return this.userRepository.save(userInfo);
  }
}
