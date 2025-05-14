import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { QueryFilterDto, QueryValuesDto } from './dto/queryValues.dto';
import {
  createUserDTO,
  UpdateUserInfoDTO,
  UpdateUserQueryDTO,
} from './dto/user.dto';
import { SafeUser, User } from './entities/user.entity';
import { UsersService } from './users.service';
import { OrderDto } from './dto/order.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getAllUsers(@Query() queryValues: QueryValuesDto) {
    return this.userService.getUsers(queryValues);
  }

  @Get('filters')
  getFilteredUsers(@Query() queryFilter: QueryFilterDto) {
    return this.userService.getFilteredUsers(queryFilter);
  }

  @Get('order')
  getOrderedUsers(@Query() order: OrderDto) {
    return this.userService.getOrderedUsers(order);
  }

  @Get('summary')
  getSummary() {
    return this.userService.getSummary();
  }

  @Get(':id')
  getUser(@Param('id') rut: string): Promise<SafeUser | null> {
    return this.userService.getUser({ rut });
  }

  @Post()
  createUser(@Body() newUser: createUserDTO): Promise<User> {
    return this.userService.createUser(newUser);
  }

  @Patch()
  updateUser(
    @Query() queryValue: UpdateUserQueryDTO,
    @Body() updatedUser: UpdateUserInfoDTO,
  ) {
    return this.userService.updateUser(queryValue.originalRut, updatedUser);
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
