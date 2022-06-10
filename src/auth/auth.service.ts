import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../modules/users/dto/create-user.dto';
import { Users } from '../modules/users/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async login(username: Users) {
    const payload = { id: username.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.checkUser(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
