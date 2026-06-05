import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateGovtUserDto } from './dto/create-govt-user.dto';
import { UpdateGovtUserDto } from './dto/update-govt-user.dto';
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.govtUsersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGovtUserDto) {
    return this.govtUsersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.govtUsersService.remove(id);
  }
}
