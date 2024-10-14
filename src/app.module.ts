import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './users/users.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.locals'],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class AppModule {}
