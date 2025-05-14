import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { envs } from './config';
import { UsersService } from './users/users.service';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    const token = header.slice(7);

    if (!header || typeof header != 'string' || !token) {
      throw new UnauthorizedException(
        'Invalid token, log in your account and try again.',
      );
    }

    try {
      const data = jwt.verify(token, envs.secret) as JwtPayload;
      const userRole = await this.userService.getUser({ rut: data.identifier });

      if (userRole.role === 'USER') {
        throw new UnauthorizedException(
          'You dont have the credentials to perform this action, try again.',
        );
      }
      next();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.response ??
          'There was a problem with the token, try again later.',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
