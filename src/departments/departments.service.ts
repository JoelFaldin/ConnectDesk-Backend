import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { NewDepartmentDTO, UpdateDepartmentDTO } from './dto/departments.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  getDepartments() {
    try {
      return this.prisma.departments.findMany();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'There was a problem in the server trying to get the directions, try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createDepartment(departmentData: NewDepartmentDTO) {
    try {
      const searchDepartment = await this.prisma.departments.findUnique({
        where: {
          name: departmentData.name,
        },
      });

      if (searchDepartment) {
        throw new HttpException(
          'Theres already a department with that name, please enter a new one.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newDepartment = await this.prisma.departments.create({
        data: {
          id: randomUUID(),
          ...departmentData,
        },
      });

      return newDepartment;
    } catch (error) {
      throw new HttpException(
        error.response ??
          'There was a problem in the server trying to create the department, try again later.',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateDepartment(id: string, departmentData: UpdateDepartmentDTO) {
    try {
      const searchDepartment = await this.prisma.departments.findUnique({
        where: {
          id,
        },
      });

      if (!searchDepartment) {
        throw new HttpException(
          'Department not found, please try with a different one.',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.prisma.departments.update({
        where: {
          id,
        },
        data: departmentData,
      });

      return {
        name: departmentData.name,
        id: searchDepartment.id,
      };
    } catch (error) {
      throw new HttpException(
        error.response ??
          'There was an error trying to update the department, try again later.',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteDepartment(id: string) {
    try {
      const searchDepartment = await this.prisma.departments.findUnique({
        where: {
          id,
        },
      });

      if (!searchDepartment) {
        throw new HttpException(
          'Department not found, try with another one.',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.prisma.departments.delete({
        where: {
          id,
        },
      });

      return {
        message: 'Department removed!',
      };
    } catch (error) {
      throw new HttpException(
        error.response ??
          'There was an error trying to delete the department, try agan later.',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
