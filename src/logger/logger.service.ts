import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LoggerService {
  constructor(private prisma: PrismaService) {}

  async addLog(data: {
    userId: string;
    endpoint: string;
    method: string;
    statusCode: number;
    description: string;
  }) {
    await this.prisma.logs.create({
      data: {
        logId: randomUUID(),
        userId: data.userId,
        endpoint: data.endpoint,
        method: data.method,
        statusCode: data.statusCode,
        description: data.description,
        date: new Date(),
      },
    });
  }
}
