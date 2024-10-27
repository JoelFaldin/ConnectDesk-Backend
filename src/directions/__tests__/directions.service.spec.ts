import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../prisma/prisma.service';
import { DirectionsService } from '../directions.service';
import { UpdateDirectionDTO } from '../dto/direction.dto';

describe('DirectionsService', () => {
  let service: DirectionsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DirectionsService,
        {
          provide: PrismaService,
          useValue: {
            directions: {
              findMany: jest.fn(),
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<DirectionsService>(DirectionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all directions', async () => {
    const directions = [
      {
        id: '1',
        name: 'North building',
        address: 'Chile',
      },
      {
        id: '2',
        name: 'South building',
        address: 'Chile',
      },
    ];

    jest.spyOn(prisma.directions, 'findMany').mockResolvedValue(directions);

    expect(await service.getDirections()).toEqual(directions);
  });

  it('creates a new direction', async () => {
    const newDirection = {
      name: 'East building',
      address: 'Chile',
    };

    const mockCreatedDirection = {
      id: '1',
      ...newDirection,
    };

    jest
      .spyOn(prisma.directions, 'create')
      .mockResolvedValue(mockCreatedDirection);

    const result = await service.createDirection(newDirection);

    expect(result).toEqual({
      ...mockCreatedDirection,
      id: expect.any(String),
    });

    expect(prisma.directions.create).toHaveBeenCalledWith({
      data: {
        ...mockCreatedDirection,
        id: expect.any(String),
      },
    });
  });

  it('should update direction', async () => {
    const direction = {
      name: 'North building',
      address: 'Chile',
      id: '1',
    };

    const updatedDirection = {
      address: 'Chile, North',
    } as UpdateDirectionDTO;

    jest.spyOn(prisma.directions, 'findUnique').mockResolvedValue(direction);

    const result = await service.updateDirection('1', updatedDirection);

    expect(result).toEqual({
      ...direction,
      address: 'Chile, North',
    });

    expect(prisma.directions.update).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
      data: updatedDirection,
    });
  });

  it('shouldnt update direction if not found', async () => {
    const direction = {
      name: 'North direction',
      address: 'Chile',
      id: '2',
    };

    const updatedDirection = {
      address: 'Chile North',
    } as UpdateDirectionDTO;

    jest
      .spyOn(prisma.directions, 'findUnique')
      .mockResolvedValueOnce(direction);

    try {
      await service.updateDirection('1', updatedDirection);
    } catch (error) {
      expect(error.status).toEqual(400);
      expect((error as HttpException).getStatus()).toEqual(
        HttpStatus.BAD_REQUEST,
      );
      expect((error as HttpException).getResponse()).toEqual(
        'Direction not found, try another one...',
      );
    }
  });

  it('should delete direction', async () => {
    const directions = {
      id: '1',
      name: 'Central building',
      address: 'Santiago',
    };

    jest.spyOn(prisma.directions, 'findUnique').mockResolvedValue(directions);

    const result = await service.deleteDirection('1');

    expect(result).toEqual({
      message: 'Direction removed!',
    });

    expect(prisma.directions.delete).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
    });
  });

  it('shouldnt delete direction', async () => {
    jest.spyOn(prisma.directions, 'findUnique').mockResolvedValue(null);

    try {
      await service.deleteDirection('2');
    } catch (error) {
      expect(error.status).toEqual(400);
      expect((error as HttpException).getStatus()).toEqual(
        HttpStatus.BAD_REQUEST,
      );
      expect((error as HttpException).getResponse()).toEqual(
        'Direction not found, try another one.',
      );
    }
  });
});
