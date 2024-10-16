import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsService } from '../departments.service';
import { PrismaService } from '../../prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('DepartmentsService', () => {
  let service: DepartmentsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentsService,
        {
          provide: PrismaService,
          useValue: {
            departments: {
              findMany: jest.fn(),
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<DepartmentsService>(DepartmentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all departments', async () => {
    const directions = [
      {
        id: '1',
        name: 'IT Department',
      },
    ];

    jest.spyOn(prisma.departments, 'findMany').mockResolvedValue(directions);

    const result = await service.getDepartments();

    expect(result).toEqual(directions);
    expect(prisma.departments.findMany).toHaveBeenCalled();
  });

  it('should create a new department', async () => {
    const newDepartment = {
      id: '1',
      name: 'Personal department',
    };

    jest.spyOn(prisma.departments, 'findUnique').mockResolvedValue(null);
    jest.spyOn(prisma.departments, 'create').mockResolvedValue(newDepartment);

    const result = await service.createDepartment({
      name: 'Personal department',
    });

    expect(result).toEqual({
      ...newDepartment,
      id: expect.any(String),
    });
    expect(prisma.departments.create).toHaveBeenCalledWith({
      data: {
        name: 'Personal department',
        id: expect.any(String),
      },
    });
  });

  it('cant create department if it exists', async () => {
    const existingDepartment = {
      name: 'IT Department',
      id: '1',
    };

    jest
      .spyOn(prisma.departments, 'findUnique')
      .mockResolvedValue(existingDepartment);

    try {
      await service.createDepartment(existingDepartment);
    } catch (error) {
      expect(error.status).toEqual(400);
      expect((error as HttpException).getStatus()).toEqual(
        HttpStatus.BAD_REQUEST,
      );
      expect((error as HttpException).getResponse()).toEqual(
        'Theres already a department with that name, please enter a new one.',
      );
    }
  });

  it('can update department', async () => {
    const updatedDepartment = {
      name: 'IT DEPARTMENT',
    };

    jest.spyOn(prisma.departments, 'findUnique').mockResolvedValue({
      ...updatedDepartment,
      id: '1',
    });

    const result = await service.updateDepartment('1', updatedDepartment);

    expect(result).toEqual({
      ...updatedDepartment,
      id: '1',
    });

    expect(prisma.departments.update).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
      data: {
        name: 'IT DEPARTMENT',
      },
    });
  });

  it('cant update department if it doesnt exists');

  it('can delete department');

  it('cant delete department if it doesnt exists');
});
