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

@Module({
  imports: [UsersModule, DirectionsModule, DepartmentsModule, AuthModule],
  controllers: [UsersController, ExcelController],
  providers: [UsersService, PrismaService, ExcelService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
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
        { path: 'excel', method: RequestMethod.ALL },
      );
  }
}
