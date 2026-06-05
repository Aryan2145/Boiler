import { Module } from '@nestjs/common';
import { GovtUsersController } from './govt-users.controller';
import { GovtUsersService } from './govt-users.service';

@Module({
  controllers: [GovtUsersController],
  providers: [GovtUsersService],
})
export class GovtUsersModule {}
