import { Module } from '@nestjs/common';

import { UsersController } from './users/users.controller';
import { PrismaService } from './prisma/prisma.service';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { DirectionsModule } from './directions/directions.module';

@Module({
  imports: [UsersModule, DirectionsModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class AppModule {}
