import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Role } from './user.entity';
import { PrismaService } from '../prisma/prisma.service';

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
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
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

    expect(await service.createUser(newUser)).toBeDefined();
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
});
