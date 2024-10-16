import { Module } from '@nestjs/common';

import { UsersController } from './users/users.controller';
import { PrismaService } from './prisma/prisma.service';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { DirectionsModule } from './directions/directions.module';
import { DepartmentsModule } from './departments/departments.module';
import { ExcelController } from './excel/excel.controller';
import { ExcelService } from './excel/excel.service';

@Module({
  imports: [UsersModule, DirectionsModule, DepartmentsModule],
  controllers: [UsersController, ExcelController],
  providers: [UsersService, PrismaService, ExcelService],
})
export class AppModule {}
