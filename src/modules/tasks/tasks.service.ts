import { Injectable, InternalServerErrorException, } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { Users } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ){

  }
 async create(createTaskDto: CreateTaskDto,users:Users) {
  const{title,description}=createTaskDto
   const task= await this.taskRepo.create({title,description,users})
   try {
    return await this.taskRepo.save(task)
   } catch (error) {
  throw new InternalServerErrorException('server fail!')
   }
  }

 async findAll(users:Users) {
    return await this.taskRepo.find({where:{users}})
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
