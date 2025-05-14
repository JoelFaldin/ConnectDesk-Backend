import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { User, Role, SafeUser, ReturnUserData } from './entities/user.entity';
import { QueryFilterDto, QueryValuesDto } from './dto/queryValues.dto';
import { createUserDTO, UpdateUserInfoDTO } from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { OrderDto } from './dto/order.dto';

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
    const { searchValue, page, pageSize } = queryValues;
    const pageNumber = page ? Number(page) : 1;
    const pageSizeNumber = pageSize ? Number(pageSize) : 5;

    const select = {
      rut: true,
      names: true,
      lastNames: true,
      email: true,
      role: true,
      departments: true,
      directions: true,
      jobNumber: true,
      contact: true,
    };

    try {
      let searchUsers;

      if (!searchValue) {
        searchUsers = await this.prisma.user.findMany({
          select: select,
          skip: (pageNumber - 1) * pageSizeNumber,
          take: pageSizeNumber,
        });
      } else {
        searchUsers = await this.prisma.user.findMany({
          where: {
            OR: [
              { rut: { contains: searchValue } },
              { names: { contains: searchValue } },
              { lastNames: { contains: searchValue } },
              { email: { contains: searchValue } },
              { departments: { contains: searchValue } },
              { directions: { contains: searchValue } },
            ],
          },
          select: select,
          skip: (pageNumber - 1) * pageSizeNumber,
          take: pageSizeNumber,
        });
      }

      const total = await this.prisma.user.count({});

      return {
        message: 'Data sent!',
        content: searchUsers,
        showing: pageSizeNumber,
        page: pageNumber,
        total: total,
        totalData: searchUsers.length,
      };
    } catch (error) {
      throw new HttpException(
        error.response ??
          'There was a problem trying to fetch users data, try again later.',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // const pageNumber = page ? Number(page) : 1;
    // const pageSizeNumber = pageSize ? Number(pageSize) : 10;

    // try {
    //   let where = {};

    //   if (searchValue) {
    //     where = {
    //       [searchColumn]: searchValue,
    //     };
    //   }

    //   const searchUsers = await this.prisma.user.findMany({
    //     where,
    //     select: {
    //       rut: true,
    //       names: true,
    //       lastNames: true,
    //       email: true,
    //       role: true,
    //       departments: true,
    //       directions: true,
    //       jobNumber: true,
    //       contact: true,
    //     },
    //     skip: (Number(pageNumber) - 1) * Number(pageSizeNumber),
    //     take: Number(pageSizeNumber),
    //   });

    //   return {
    //     message: 'Data sent!',
    //     content: searchUsers,
    //     totalData: searchUsers.length,
    //   };
    // } catch (error) {
    //   throw new HttpException(
    //     error.response ??
    //       'There was a problem trying to fetch users data, try again later.',
    //     error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
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
      throw new HttpException(
        error.response ??
          'There was a problem trying filter users, try again later.',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrderedUsers(orderFilterData: OrderDto) {
    try {
      const { column, order, searchValue, searchColumn, pageSize, page } =
        orderFilterData;

      if (column && order && !searchValue && !searchColumn) {
        return this.prisma.user.findMany({
          orderBy: [
            {
              [column]: order,
            },
          ],
          skip: page === 1 ? 0 : page * pageSize,
          take: pageSize,
        });
      } else if (!column && !order && !searchValue && !searchColumn) {
        return this.prisma.user.findMany({
          skip: page === 1 ? 0 : page * pageSize,
          take: pageSize,
        });
      } else if (column && order && searchValue && searchColumn) {
        return this.prisma.user.findMany({
          orderBy: {
            [column]: order,
          },
          skip: page === 1 ? 0 : page * pageSize,
          take: pageSize,
          where: {
            [searchColumn]: {
              contains: searchValue,
            },
          },
        });
      } else if (!column && !order && searchValue && searchColumn) {
        return this.prisma.user.findMany({
          skip: page === 1 ? 0 : page * pageSize,
          take: pageSize,
          where: {
            [searchColumn]: {
              contains: searchValue,
            },
          },
        });
      } else if (column && !order) {
        return this.prisma.user.findMany({
          skip: page === 1 ? 0 : page * pageSize,
          take: pageSize,
        });
      } else {
        throw new HttpException(
          'Invalid request, please try again.',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        'There was a problem trying to order and filter the data, try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(newUser: createUserDTO): Promise<ReturnUserData | null> {
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
          role: newUser.role ?? 'USER',
        },
      });

      return {
        message: 'User created!',
        ...user,
        role: newUser.role ?? 'USER',
      };
    } catch (error) {
      throw new HttpException(
        error.response ?? 'There was an error on the server, try again later.',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(originalRut: string, updatedUser: UpdateUserInfoDTO) {
    const { values } = updatedUser;

    try {
      const searchUser = await this.prisma.user.findUnique({
        where: {
          rut: originalRut,
        },
      });

      if (!searchUser) {
        throw new HttpException(
          'User not found, try with a different one.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newUser = {};

      values.forEach(({ columnName, value }) => {
        newUser[columnName] = value;
      });

      await this.prisma.user.update({
        where: {
          rut: originalRut,
        },
        data: newUser,
      });

      return {
        message: 'User updated!',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.response ??
          'There was a problem in the server trying to update the user, try again later.',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // try {
    //   const { values, pageSize, page } = updatedUser;
    //   const skip = (page - 1) * pageSize;
    //   const userData = await this.prisma.user.findMany({
    //     skip,
    //     take: pageSize,
    //   });
    //   const newUser = {};
    //   values.forEach(({ columnId, value }) => {
    //     newUser[columnId] = value;
    //   });
    //   await this.prisma.user.update({
    //     where: {
    //       rut: userData[values[0].rowIndex].rut,
    //     },
    //     data: newUser,
    //   });
    //   return {
    //     message: 'User updated!',
    //   };
    // } catch (error) {
    //   throw new HttpException(
    //     error.response ??
    //       'There was a problem in the server trying to update the user, try again later.',
    //     error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
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
      throw new HttpException(
        error.response ??
          'There was an error trying to update the users role, try again later.',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSummary() {
    try {
      const userCount = await this.prisma.user.count({});

      return userCount;
    } catch (error) {
      throw new HttpException(
        error.response ??
          'There was an error trying to update the users role, try again later.',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
