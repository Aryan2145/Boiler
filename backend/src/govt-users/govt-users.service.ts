import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { publicGovtUser } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGovtUserDto } from './dto/create-govt-user.dto';

const SALT_ROUNDS = 10;
const DEFAULT_OFFICER_PASSWORD = 'Officer@123';

@Injectable()
export class GovtUsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.govtUser.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return users.map(publicGovtUser);
  }

  async create(dto: CreateGovtUserDto) {
    const email = dto.email.toLowerCase();
    const existing = await this.prisma.govtUser.findUnique({
      where: { email },
    });
    if (existing) {
      throw new ConflictException(
        'A government user with this email already exists.',
      );
    }

    const user = await this.prisma.govtUser.create({
      data: {
        name: dto.name.trim(),
        role: dto.role,
        phone: dto.phone.trim(),
        email,
        zone: dto.zone.trim(),
        passwordHash: await bcrypt.hash(
          dto.password ?? DEFAULT_OFFICER_PASSWORD,
          SALT_ROUNDS,
        ),
      },
    });
    return publicGovtUser(user);
  }

  async remove(id: string) {
    const user = await this.prisma.govtUser.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found.');
    if (user.role === 'ADMIN') {
      throw new ForbiddenException(
        'The administrator account cannot be deleted.',
      );
    }
    await this.prisma.govtUser.delete({ where: { id } });
    return { ok: true };
  }
}
