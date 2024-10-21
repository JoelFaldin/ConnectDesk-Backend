import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare, hash } from 'bcrypt';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { envs } from 'src/config';
import { randomUUID } from 'crypto';
import { GetPasswordDTO } from './dto/getPassword.dto';
import sendEmail from 'src/config/email';
import { tokenDTO } from './dto/token.dto';
import { ResetPasswordDTO } from './dto/resetPass.dto';

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

  async getPassword(getPassword: GetPasswordDTO) {
    const { rut, email } = getPassword;

    try {
      const searchUser = await this.prisma.user.findUnique({
        where: {
          rut,
        },
      });

      if (!searchUser) {
        throw new NotFoundException('User not found, try with another rut.');
      } else if (searchUser.email != email) {
        throw new BadRequestException(
          'The email does not match, try again with another one.',
        );
      }

      const expiration = '5m';
      const token = sign({ rut }, envs.secret, { expiresIn: expiration });

      await this.prisma.recoverPassword.create({
        data: {
          rut,
          token,
        },
      });

      const link = `http://localhost:5173/newPassword?token=${token}`;
      const subject = 'Password reset';
      const content = `
        Hey, to continue with the password reset process,
        you should click this link:
        ${link}
      `;

      sendEmail(searchUser.email, subject, content);

      return {
        message: 'Email sent, check your email!',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.response ?? 'There was a problem in the server, try again later.',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  validateToken(clientToken: tokenDTO) {
    const { token } = clientToken;

    try {
      if (!token) {
        throw new NotFoundException('Token not found.');
      }

      verify(token, envs.secret);
      return {
        valid: true,
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Invalid token, try again later.',
      };
    }
  }

  async resetPassword(resetPassword: ResetPasswordDTO) {
    const { newPassword, token } = resetPassword;

    try {
      const tokenData = verify(token, envs.secret) as JwtPayload;
      const user = await this.prisma.user.findUnique({
        where: {
          rut: tokenData.rut,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found, try again.');
      }

      const salt = 10;
      const hashed = await hash(newPassword, salt);

      await this.prisma.user.update({
        where: {
          rut: tokenData.rut,
        },
        data: {
          password: hashed,
        },
      });

      return {
        message: 'Password updated!',
      };
    } catch (error) {
      throw new HttpException(
        error.response ?? 'There was a problem in the server, try again later.',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
