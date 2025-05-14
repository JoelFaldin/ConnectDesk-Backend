import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { UsersController } from './users/users.controller';
import { PrismaService } from './prisma/prisma.service';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { DirectionsModule } from './directions/directions.module';
import { DepartmentsModule } from './departments/departments.module';
import { ExcelController } from './excel/excel.controller';
import { ExcelService } from './excel/excel.service';
import { AuthModule } from './auth/auth.module';
import { TokenMiddleware } from './token.middleware';
import { LoggerMiddleware } from './logger/logger.middleware';
import { LoggerService } from './logger/logger.service';
import { LogsModule } from './logs/logs.module';
import { LogsService } from './logs/logs.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    UsersModule,
    DirectionsModule,
    DepartmentsModule,
    AuthModule,
    LogsModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 50,
        },
      ],
    }),
  ],
  controllers: [UsersController, ExcelController],
  providers: [
    UsersService,
    PrismaService,
    ExcelService,
    LoggerService,
    LogsService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        { path: 'users', method: RequestMethod.GET },
        { path: 'logs', method: RequestMethod.GET },
        { path: 'logs/:code', method: RequestMethod.GET },
        { path: 'users/summary', method: RequestMethod.GET },
        { path: 'excel/summary', method: RequestMethod.GET },
        { path: 'auth/ping', method: RequestMethod.GET },
      )
      .forRoutes('*');
    consumer
      .apply(TokenMiddleware)
      .forRoutes(
        { path: 'users', method: RequestMethod.POST },
        { path: 'users', method: RequestMethod.PATCH },
        { path: 'users/:id', method: RequestMethod.DELETE },
        { path: 'users/role/:id', method: RequestMethod.PATCH },
        { path: 'departments', method: RequestMethod.POST },
        { path: 'departments/:id', method: RequestMethod.PATCH },
        { path: 'departments/:id', method: RequestMethod.DELETE },
        { path: 'directions', method: RequestMethod.POST },
        { path: 'directions/:id', method: RequestMethod.PATCH },
        { path: 'directions/:id', method: RequestMethod.DELETE },
        { path: 'excel/download/logs', method: RequestMethod.GET },
        { path: 'excel/template', method: RequestMethod.GET },
        { path: 'excel/upload', method: RequestMethod.POST },
      );
  }
}
