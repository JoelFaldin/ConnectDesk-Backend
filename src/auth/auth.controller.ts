import { Controller, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GetPasswordDTO } from './dto/getPassword.dto';
import { tokenDTO } from './dto/token.dto';

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
}
