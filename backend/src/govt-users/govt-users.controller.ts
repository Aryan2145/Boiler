import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateGovtUserDto } from './dto/create-govt-user.dto';
import { GovtUsersService } from './govt-users.service';

@Controller('govt/users')
@UseGuards(JwtAuthGuard, AdminGuard)
export class GovtUsersController {
  constructor(private readonly govtUsersService: GovtUsersService) {}

  @Get()
  findAll() {
    return this.govtUsersService.findAll();
  }

  @Post()
  create(@Body() dto: CreateGovtUserDto) {
    return this.govtUsersService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.govtUsersService.remove(id);
  }
}
