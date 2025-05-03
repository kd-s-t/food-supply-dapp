import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    const user = this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('logout')
  logout() {
    return { message: 'Logged out (client should delete token)' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtected() {
    return { message: 'You have accessed a protected route!' };
  }
}
