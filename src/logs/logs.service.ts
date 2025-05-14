import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class LogsService {
  constructor(private readonly prisma: PrismaService) {}

  getAll() {
    return this.prisma.logs.findMany({
      select: {
        logId: true,
        description: true,
        date: true,
      },
    });
  }

  async findAll(pagination: PaginationDto) {
    const { page, pageSize } = pagination;

    const res = await this.prisma.logs.findMany({
      skip: page * pageSize,
      take: pageSize,
    });

    const count = await this.prisma.logs.count({});

    return {
      message: 'Logs sent!',
      content: res,
      pageSize: pageSize,
      page: page,
      total: count,
    };
  }

  async findByCode(code: number, queryValues: PaginationDto) {
    const { page, pageSize } = queryValues;

    let where = {};

    if (Number(code) === 400) {
      where = {
        statusCode: { in: [code, 404, 500] },
      };
    } else if (Number(code) !== 1) {
      where = {
        statusCode: code,
      };
    }

    const res = await this.prisma.logs.findMany({
      where: where,
      skip: page * pageSize,
      take: pageSize,
    });

    const count = await this.prisma.logs.count({
      where: where,
    });

    return {
      content: res,
      pageSize: pageSize,
      page: page,
      total: count,
    };
  }

  findOne(id: string) {
    return this.prisma.logs.findUnique({
      where: {
        logId: id,
      },
    });
  }

  getSummary() {
    return this.prisma.logs.count({});
  }
}
