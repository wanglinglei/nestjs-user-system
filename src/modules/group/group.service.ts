import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Repository, Like, Equal, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { User } from '../user/entities/user.entity';
@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  create(createGroupDto: CreateGroupDto) {
    console.log('create', createGroupDto);

    return this.groupRepository.save(createGroupDto);
  }

  findAll() {
    return this.groupRepository.find({
      relations: ['users'],
      order: {
        id: 'ASC',
      },
    });
  }

  findAllByIds(ids: number[]) {
    return this.groupRepository.findBy({ id: In(ids) });
  }

  findOne(id: number) {
    return `This action returns a #${id} group`;
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
