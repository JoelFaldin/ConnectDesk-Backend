import { Test, TestingModule } from '@nestjs/testing';

import { DepartmentsController } from '../departments.controller';
import { DepartmentsService } from '../departments.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('DepartmentsController', () => {
  let controller: DepartmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentsController],
      providers: [PrismaService, DepartmentsService],
    }).compile();

    controller = module.get<DepartmentsController>(DepartmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
