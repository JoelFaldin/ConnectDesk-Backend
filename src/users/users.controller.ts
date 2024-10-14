import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { createUserDTO, updateUserDTO } from './dto/user.dto';
import { SafeUser } from './user.entity';

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
  createUser(@Body() newUser: createUserDTO) {
    return this.userService.createUser(newUser);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updatedUser: updateUserDTO) {
    return this.userService.updateUser(id, updatedUser);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
