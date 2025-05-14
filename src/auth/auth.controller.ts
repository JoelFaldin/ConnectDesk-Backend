import { Controller, Post, Body, Headers, Patch, Get } from '@nestjs/common';

import { GetPasswordDTO } from './dto/getPassword.dto';
import { ResetPasswordDTO } from './dto/resetPass.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { tokenDTO } from './dto/token.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }

  @Post('logout')
  logout(@Headers('authorization') header: string) {
    const token = header?.replace('Bearer ', '');
    return this.authService.logout(token);
  }

  @Post('password')
  getPassword(@Body() getPassword: GetPasswordDTO) {
    return this.authService.getPassword(getPassword);
  }

  @Post('validate')
  validateToken(@Body() token: tokenDTO) {
    return this.authService.validateToken(token);
  }

  @Patch('restore')
  resetPassword(@Body() resetPassword: ResetPasswordDTO) {
    return this.authService.resetPassword(resetPassword);
  }

  @Get('ping')
  checkServer() {
    return {
      status: 'ok',
      statusCode: 200,
      timeStamp: new Date(),
    };
  }
}
