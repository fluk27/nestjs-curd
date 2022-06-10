import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, UseGuards, UseInterceptors} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { UserInterceptor } from '../../Interceptor/user.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  signup(@Body() createUserDto: CreateUserDto) {
   return  this.usersService.create(createUserDto);
  }
  @Post('/signin')
  signin(@Body() createUserDto: CreateUserDto) {
   return  this.usersService.create(createUserDto);
  }
  @UseInterceptors(UserInterceptor)
@UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
 return this.usersService.findOne(id)

  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
