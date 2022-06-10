import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository, Connection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Task } from '../tasks/entities/task.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    private readonly connection: Connection,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const result = await this.checkUserDuplicate(createUserDto.username);

    if (result) {
      const queryrunner = this.connection.createQueryRunner();
      await queryrunner.connect();
      await queryrunner.startTransaction();

      try {
        const { firstName, lastName, username, password, isActive } =
          createUserDto;
        const hashPassword = await bcrypt.hash(password, 10);
        const dataUser = await queryrunner.manager.save(Users, {
          firstName: firstName,
          lastName: lastName,
          username: username,
          isActive: isActive,
          password: hashPassword,
        });
        await queryrunner.commitTransaction();
        return {
          status: true,
          data: dataUser,
          massages: 'create user successfully!',
        };
      } catch (error) {
        await queryrunner.rollbackTransaction();
        Logger.error(error);
        return {
          status: false,
          massages: 'create user fail!',
        };
      } finally {
        await queryrunner.release();
      }
    } else {
      throw new HttpException('username duplicate', HttpStatus.CONFLICT);
    }
  }

  async findAll() {
    try {
      return await this.userRepo.find({ relations: ['task'] });
    } catch (error) {
      throw new HttpException(
        'fine all user fail!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(uuid: string) {
    const result = await this.userRepo
      .findOne({ where: { id: uuid } })
      .then((result) => {
        return {
          statuscode: result ? 200 : 422,
          data: result,
          massages: result ? null : 'data user by id empty!',
        };
      })
      .catch((err) => {
        Logger.error(err);
        return {
          statuscode: 500,
          massages: 'fine one user  fail!',
        };
      });
    if (result.statuscode === 200) {
      return result;
    } else {
      switch (result.statuscode) {
        case 422:
          throw new HttpException(
            result.massages,
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
          break;
        case 500:
          throw new HttpException(
            result.massages,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );

        default:
          break;
      }
    }
  }

  async update(uuid: string, updateUserDto: UpdateUserDto): Promise<Users> {
    const dataUser = await this.userRepo.findOne({ where: { id: uuid } });
    if (dataUser) {
      const hashPassword = await bcrypt.hash(updateUserDto.password, 10);
      const dataEdit = {
        id: dataUser.id,
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        username: updateUserDto.username,
        isActive: updateUserDto.isActive,
        password: hashPassword,
      };
      const queryrunner = this.connection.createQueryRunner();
      await queryrunner.connect();
      await queryrunner.startTransaction();
      try {
        return await queryrunner.manager.save(Users, dataEdit);
      } catch (error) {
        Logger.error(error.toString());
        await queryrunner.rollbackTransaction();
        throw new InternalServerErrorException('service user fail.');
      } finally {
        await queryrunner.release();
      }
    } else {
      throw new HttpException(
        'data user empty',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async remove(uuid: string) {
    const dataUser = await this.userRepo.findOne({ where: { id: uuid } });
    if (dataUser) {
      const queryrunner = this.connection.createQueryRunner();
      await queryrunner.connect();
      await queryrunner.startTransaction();
      try {
        return await queryrunner.manager.delete(Users, uuid);
      } catch (error) {
        await queryrunner.rollbackTransaction();
      } finally {
        await queryrunner.release();
      }
    } else {
      throw new HttpException(
        'data user empty',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
  async checkUserDuplicate(username: string): Promise<boolean> {
    const dataUser = await this.userRepo.findOne({
      where: { username: username },
    });
    if (dataUser) {
      return false;
    } else {
      return true;
    }
  }
  async checkUser(username: string): Promise<any> {
    return await this.userRepo.findOne({
      where: { username: username },
    });
  }
}
