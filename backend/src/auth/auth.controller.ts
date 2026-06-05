import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { JwtPayload } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { ContractorSignupDto } from './dto/contractor-signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('contractor/signup')
  contractorSignup(@Body() dto: ContractorSignupDto) {
    return this.authService.contractorSignup(dto);
  }

  @Post('contractor/login')
  contractorLogin(@Body() dto: LoginDto) {
    return this.authService.contractorLogin(dto);
  }

  @Post('govt/login')
  govtLogin(@Body() dto: LoginDto) {
    return this.authService.govtLogin(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: JwtPayload) {
    return this.authService.profile(user);
  }
}
