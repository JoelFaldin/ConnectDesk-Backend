import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { envs } from 'src/config';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(createAuthDto: LoginDto) {
    const { identifier, password } = createAuthDto;

    try {
      const user = await this.prisma.user.findUnique({
        where: {
          rut: identifier,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found, try another rut...');
      }

      const comparePassword = await compare(password, user.password);

      if (!comparePassword) {
        throw new UnauthorizedException('Wrong password! Try again.');
      }

      const userToken = {
        names: user.names,
        identifier: user.rut,
      };

      const token = sign(userToken, envs.secret);

      return {
        message: 'Login successfully! Redirecting...',
        token,
        nombres: user.names,
        identifier: user.rut,
        access: user.role,
      };
    } catch (error) {
      throw new HttpException(
        error.response ?? 'There was a server error, try again later.',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logout(token: string) {
    const date = new Date();
    const expiration = new Date(date);
    expiration.setDate(date.getDate() + 1);
    expiration.setHours(11, 15, 0, 0);

    if (token) {
      try {
        await this.prisma.blackList.create({
          data: {
            id: randomUUID(),
            token,
            expiration,
          },
        });

        return {
          message: 'Successfully logged out!',
        };
      } catch (error) {
        throw new HttpException(
          error.response ??
            'There was a problem in the server when trying to log out.',
          error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      throw new UnauthorizedException(
        'You dont have a token! Please log in again.',
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    console.log(updateAuthDto);
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
