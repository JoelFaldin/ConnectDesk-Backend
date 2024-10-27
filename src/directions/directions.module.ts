import { Module } from '@nestjs/common';

import { DirectionsController } from './directions.controller';
import { DirectionsService } from './directions.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DirectionsController],
  providers: [DirectionsService, PrismaService],
})
export class DirectionsModule {}
