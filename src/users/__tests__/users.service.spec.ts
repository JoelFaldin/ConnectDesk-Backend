import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users.service';
import { updateUserDTO } from '../dto/user.dto';
import { Role } from '../entities/user.entity';

describe('UserService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get user', async () => {
    const user = {
      id: '1',
      names: 'test',
      lastNames: 'tester',
      email: 'test@gmail.com',
      role: Role.USER,
      departments: 'Test Department',
      directions: 'Test building',
      jobNumber: '9 0000 0000',
      contact: '9 0000 0000',
    };

    jest.spyOn(service, 'getUser').mockResolvedValue(user);

    expect(await service.getUser({ id: '1' })).toEqual(user);
  });

  it('should return a list of users', async () => {
    const users = [
      {
        id: '1',
        names: 'test',
        lastNames: 'tester',
        email: 'test@gmail.com',
        role: Role.USER,
        departments: 'Test Department',
        directions: 'Test building',
        jobNumber: '9 0000 0000',
        contact: '9 0000 0000',
      },
      {
        id: '2',
        names: 'test2',
        lastNames: 'tester2',
        email: 'test2@gmail.com',
        role: Role.USER,
        departments: 'Test Department',
        directions: 'Test building',
        jobNumber: '9 0000 0000',
        contact: '9 0000 0000',
      },
    ];

    jest.spyOn(service, 'getUsers').mockResolvedValue(users);

    expect(await service.getUsers()).toEqual(users);
  });

  it('should create a user', async () => {
    const newUser = {
      names: 'Test',
      lastNames: 'test',
      email: 'newtest@gmail.com',
      password: 'testpass',
      role: Role.USER,
      departments: 'Test department',
      directions: 'Test building',
      jobNumber: '9 0000 0000',
      contact: '9 0000 0000',
    };

    const mockCreatedUser = {
      id: '1',
      ...newUser,
    };

    jest.spyOn(prisma.user, 'create').mockResolvedValue(mockCreatedUser);

    const result = await service.createUser(newUser);

    expect(result).toEqual({
      ...mockCreatedUser,
      role: Role.USER,
    });

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        ...result,
        id: expect.any(String),
        password: expect.any(String),
      },
    });
  });

  it('shouldnt create an user with an existing email', async () => {
    const newUser = {
      id: '1',
      names: 'Test',
      lastNames: 'test',
      email: 'newtest@gmail.com',
      password: 'testpass',
      role: Role.USER,
      departments: 'Test department',
      directions: 'Test building',
      jobNumber: '9 0000 0000',
      contact: '9 0000 0000',
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(newUser);

    try {
      await service.createUser(newUser);
    } catch (error) {
      expect(error.status).toEqual(400);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect((error as HttpException).getResponse()).toBe(
        'User with that email already exists! Try another one.',
      );
    }
  });

  it('should update user', async () => {
    const newUser = {
      id: '1',
      names: 'Test',
      lastNames: 'test',
      email: 'newtest@gmail.com',
      password: 'testpass',
      role: Role.USER,
      departments: 'Test department',
      directions: 'Test building',
      jobNumber: '9 0000 0000',
      contact: '9 0000 0000',
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(newUser);

    const updatedUser = {
      names: 'Test 1',
    } as updateUserDTO;

    jest.spyOn(prisma.user, 'update').mockResolvedValue({
      ...newUser,
      names: 'Test 1',
    });

    expect(await service.updateUser(newUser.id, updatedUser)).toEqual({
      ...newUser,
      names: 'Test 1',
    });
  });

  it('shouldnt update user if is not found', async () => {
    const newUser = {
      names: 'Test',
    } as updateUserDTO;

    try {
      await service.updateUser('1', newUser);
    } catch (error) {
      expect(error.status).toEqual(400);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect((error as HttpException).getResponse()).toBe(
        'User not found, try with a different one.',
      );
    }
  });

  it('should delete an existing user', async () => {
    const newUser = {
      id: '1',
      names: 'Test',
      lastNames: 'test',
      email: 'newtest@gmail.com',
      password: 'testpass',
      role: Role.USER,
      departments: 'Test department',
      directions: 'Test building',
      jobNumber: '9 0000 0000',
      contact: '9 0000 0000',
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(newUser);
    jest.spyOn(prisma.user, 'delete').mockResolvedValue(newUser);

    await service.deleteUser('1');

    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
    });
  });

  it('shouldnt delete user if not found', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    try {
      await service.deleteUser('1');
    } catch (error) {
      expect(error.status).toEqual(400);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect((error as HttpException).getResponse()).toBe(
        'User not found, try with a different one.',
      );
    }
  });
});
