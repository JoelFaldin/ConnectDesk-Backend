import { Module } from '@nestjs/common';

import { UsersController } from './users/users.controller';
import { PrismaService } from './prisma/prisma.service';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { DirectionsModule } from './directions/directions.module';
import { DepartmentsModule } from './departments/departments.module';

@Module({
  imports: [UsersModule, DirectionsModule, DepartmentsModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class AppModule {}
