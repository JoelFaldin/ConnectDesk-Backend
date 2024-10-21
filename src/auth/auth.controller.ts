import { Controller, Post, Body, Headers, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GetPasswordDTO } from './dto/getPassword.dto';
import { tokenDTO } from './dto/token.dto';
import { ResetPasswordDTO } from './dto/resetPass.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
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
}
