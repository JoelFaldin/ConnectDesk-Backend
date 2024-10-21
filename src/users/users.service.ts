import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { createUserDTO, UpdateUserInfoDTO } from './dto/user.dto';
import { User, Role, SafeUser } from './entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';
import { QueryFilterDto, QueryValuesDto } from './dto/queryValues.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUser(
    userUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<SafeUser | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: userUniqueInput,
      });

      return {
        ...user,
        role: Role[user.role as keyof typeof Role],
      };
    } catch (error) {
      throw new HttpException(
        error.response ??
          'An error ocurred trying to get all users, try again later.',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUsers(queryValues: QueryValuesDto): Promise<User[] | object> {
    const { searchValue, searchColumn, page, pageSize } = queryValues;
    const pageNumber = page ? Number(page) : 1;
    const pageSizeNumber = pageSize ? Number(pageSize) : 10;

    try {
      let where = {};

      if (searchValue) {
        where = {
          [searchColumn]: searchValue,
        };
      }

      const searchUsers = await this.prisma.user.findMany({
        where,
        skip: (Number(pageNumber) - 1) * Number(pageSizeNumber),
        take: Number(pageSizeNumber),
      });

      return {
        message: 'Data sent!',
        content: searchUsers,
        totalData: searchUsers.length,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getFilteredUsers(queryFilter: QueryFilterDto) {
    const { column, sendOrder, page, pageSize } = queryFilter;

    try {
      let users = {};

      if (column !== '' && Number(sendOrder) !== 0) {
        const sort = {};
        sort[column] = sendOrder;

        users = await this.prisma.user.findMany({
          orderBy: Number(sendOrder) == 0 ? {} : sort,
          take: Number(pageSize),
          skip: (Number(page) - 1) * Number(pageSize),
        });
      } else {
        users = await this.prisma.user.findMany({
          take: Number(pageSize),
          skip: (Number(page) - 1) * Number(pageSize),
        });
      }

      const count = await this.prisma.user.count();

      return {
        message: 'Data filtered!',
        content: users,
        totalData: count,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async createUser(newUser: createUserDTO): Promise<User | null> {
    try {
      const searchUser = await this.prisma.user.findUnique({
        where: {
          email: newUser.email,
        },
      });

      if (searchUser) {
        throw new HttpException(
          'User with that email already exists! Try another one.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Create user:
      const salt = 10;
      const hash = await bcrypt.hash(newUser.password, salt);
      const user = await this.prisma.user.create({
        data: {
          rut: newUser.rut,
          ...newUser,
          password: hash,
        },
      });

      return {
        ...user,
        role: Role[newUser.role as keyof typeof Role],
      };
    } catch (error) {
      // console.log(error);
      throw new HttpException(
        error.response ?? 'There was an error on the server, try again later.',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(updatedUser: UpdateUserInfoDTO) {
    try {
      const { values, pageSize, page } = updatedUser;
      const skip = (page - 1) * pageSize;

      const userData = await this.prisma.user.findMany({
        skip,
        take: pageSize,
      });

      const newUser = {};
      values.forEach(({ columnId, value }) => {
        newUser[columnId] = value;
      });

      await this.prisma.user.update({
        where: {
          rut: userData[values[0].rowIndex].rut,
        },
        data: newUser,
      });

      return {
        message: 'User updated!',
      };
    } catch (error) {
      throw new HttpException(
        error.response ??
          'There was a problem in the server trying to update the user, try again later.',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(rut: string) {
    try {
      const searchUser = await this.prisma.user.findUnique({
        where: {
          rut,
        },
      });

      if (!searchUser) {
        throw new HttpException(
          'User not found, try with a different one.',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.prisma.user.delete({
        where: {
          rut,
        },
      });
      return {
        message: 'User removed!',
      };
    } catch (error) {
      // console.log(error);
      throw new HttpException(
        error.response ??
          'There was a problem trying to remove the user, try again later.',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserRole(rut: string) {
    try {
      const searchUser = await this.prisma.user.findUnique({
        where: {
          rut,
        },
      });

      if (!searchUser) {
        throw new HttpException('User not found D:', HttpStatus.BAD_REQUEST);
      }

      const updatedUser = await this.prisma.user.update({
        where: {
          rut,
        },
        data: {
          role: searchUser.role === 'ADMIN' ? 'USER' : 'ADMIN',
        },
      });

      return updatedUser.role === 'ADMIN'
        ? { message: 'This user is now an admin!' }
        : { message: 'This user is no longer an admin!' };
    } catch (error) {
      // console.log(error);
      throw new HttpException(
        error.response ??
          'There was an error trying to update the users role, try again later.',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
