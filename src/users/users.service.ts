import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

import { createUserDTO, updateUserDTO } from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User, Role, SafeUser } from './user.entity';

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
      // console.log(error);
      throw new HttpException(
        'An error ocurred trying to get all users, try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUsers(): Promise<User[] | object> {
    const users = this.prisma.user.findMany({});
    return users;
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
          id: randomUUID(),
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

  async updateUser(id: string, updatedUser: updateUserDTO) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new HttpException(
          'User not found, try with a different one.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Update the user:
      const newUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: updatedUser,
      });

      return newUser;
    } catch (error) {
      // console.log(error);
      throw new HttpException(
        error.response ??
          'There was a problem in the server trying to update the user, try again later.',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(id: string) {
    try {
      const searchUser = await this.prisma.user.findUnique({
        where: {
          id,
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
          id,
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

  async updateUserRole(id: string) {
    try {
      const searchUser = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!searchUser) {
        throw new HttpException('User not found D:', HttpStatus.BAD_REQUEST);
      }

      const updatedUser = await this.prisma.user.update({
        where: {
          id,
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
        'There was an error trying to update the users role, try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
