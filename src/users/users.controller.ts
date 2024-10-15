import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { createUserDTO, updateUserDTO } from './dto/user.dto';
import { UsersService } from './users.service';
import { SafeUser, User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  getUser(@Param('id') id: string): Promise<SafeUser | null> {
    return this.userService.getUser({ id });
  }

  @Post()
  createUser(@Body() newUser: createUserDTO): Promise<User> {
    return this.userService.createUser(newUser);
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updatedUser: updateUserDTO,
  ): Promise<User> {
    return this.userService.updateUser(id, updatedUser);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Patch('/role/:id')
  updateUserRole(@Param('id') id: string) {
    return this.userService.updateUserRole(id);
  }
}
