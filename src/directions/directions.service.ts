import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDirectionDTO, UpdateDirectionDTO } from './dto/direction.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class DirectionsService {
  constructor(private prisma: PrismaService) {}

  getDirections() {
    try {
      return this.prisma.directions.findMany();
    } catch (error) {
      // console.log(error);
      throw new HttpException(
        'There was an error trying to get all the directions, try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createDirection(newDirection: CreateDirectionDTO) {
    try {
      const direction = await this.prisma.directions.create({
        data: {
          id: randomUUID(),
          ...newDirection,
        },
      });

      return direction;
    } catch (error) {
      // console.log(error);
      throw new HttpException(
        'There was a problem trying to create the direction, try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateDirection(id: string, updateDirection: UpdateDirectionDTO) {
    try {
      const direction = await this.prisma.directions.findUnique({
        where: {
          id,
        },
      });

      if (!direction) {
        throw new HttpException(
          'Direction not found, try another one...',
          HttpStatus.BAD_REQUEST,
        );
      }

      const updated = await this.prisma.directions.update({
        where: {
          id,
        },
        data: updateDirection,
      });

      return updated;
    } catch (error) {
      // console.log(error);
      throw new HttpException(
        error.response ??
          'There was a problem in the server trying to create the direction, try again later.',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteDirection(id: string) {
    try {
      const direction = await this.prisma.directions.findUnique({
        where: {
          id,
        },
      });

      if (!direction) {
        throw new HttpException(
          'Direction not found, try another one.',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.prisma.directions.delete({
        where: {
          id,
        },
      });
      return {
        message: 'Direction removed!',
      };
    } catch (error) {
      // console.log(error);
      throw new HttpException(
        error.response ??
          'There was a problem trying to delete the direction, try again later.',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
