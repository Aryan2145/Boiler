import {
  ConflictException,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Contractor, GovtUser } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ContractorSignupDto } from './dto/contractor-signup.dto';
import { LoginDto } from './dto/login.dto';

const SALT_ROUNDS = 10;

export type JwtPayload = {
  sub: string;
  type: 'contractor' | 'govt';
  role: string | null;
  email: string;
};

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  /** Seed the admin user on first boot. */
  async onModuleInit() {
    const email = this.config
      .get<string>('ADMIN_EMAIL', 'admin@boiler.gov.in')
      .toLowerCase();
    const existing = await this.prisma.govtUser.findUnique({
      where: { email },
    });
    if (!existing) {
      const password = this.config.get<string>('ADMIN_PASSWORD', 'Admin@123');
      await this.prisma.govtUser.create({
        data: {
          name: 'System Administrator',
          role: 'ADMIN',
          phone: '',
          email,
          zone: 'Headquarters',
          passwordHash: await bcrypt.hash(password, SALT_ROUNDS),
        },
      });
      this.logger.log(`Seeded admin user ${email}`);
    }
  }

  // ── Contractor ─────────────────────────────────────────────────

  async contractorSignup(dto: ContractorSignupDto) {
    const email = dto.email.toLowerCase();

    const emailTaken = await this.prisma.contractor.findUnique({
      where: { email },
    });
    if (emailTaken) {
      throw new ConflictException('An account with this email already exists.');
    }

    const licenseTaken = await this.prisma.contractor.findFirst({
      where: { licenseNo: { equals: dto.licenseNo.trim(), mode: 'insensitive' } },
    });
    if (licenseTaken) {
      throw new ConflictException('This license number is already registered.');
    }

    const contractor = await this.prisma.contractor.create({
      data: {
        fullName: dto.fullName.trim(),
        licenseNo: dto.licenseNo.trim(),
        companyName: dto.companyName.trim(),
        companyAddress: dto.companyAddress.trim(),
        telephone: dto.telephone.trim(),
        email,
        passwordHash: await bcrypt.hash(dto.password, SALT_ROUNDS),
      },
    });

    return this.contractorAuthResponse(contractor);
  }

  async contractorLogin(dto: LoginDto) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (
      !contractor ||
      !(await bcrypt.compare(dto.password, contractor.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    return this.contractorAuthResponse(contractor);
  }

  // ── Government (admin + officers share one login) ──────────────

  async govtLogin(dto: LoginDto) {
    const user = await this.prisma.govtUser.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    return this.govtAuthResponse(user);
  }

  // ── Profile for an authenticated token ─────────────────────────

  async profile(payload: JwtPayload) {
    if (payload.type === 'contractor') {
      const contractor = await this.prisma.contractor.findUnique({
        where: { id: payload.sub },
      });
      if (!contractor) throw new UnauthorizedException();
      return { type: 'contractor' as const, user: publicContractor(contractor) };
    }
    const user = await this.prisma.govtUser.findUnique({
      where: { id: payload.sub },
    });
    if (!user) throw new UnauthorizedException();
    return { type: 'govt' as const, user: publicGovtUser(user) };
  }

  // ── Helpers ─────────────────────────────────────────────────────

  private contractorAuthResponse(contractor: Contractor) {
    const payload: JwtPayload = {
      sub: contractor.id,
      type: 'contractor',
      role: null,
      email: contractor.email,
    };
    return {
      accessToken: this.jwt.sign(payload),
      type: 'contractor' as const,
      user: publicContractor(contractor),
    };
  }

  private govtAuthResponse(user: GovtUser) {
    const payload: JwtPayload = {
      sub: user.id,
      type: 'govt',
      role: user.role,
      email: user.email,
    };
    return {
      accessToken: this.jwt.sign(payload),
      type: 'govt' as const,
      user: publicGovtUser(user),
    };
  }
}

export function publicContractor(c: Contractor) {
  const { passwordHash: _passwordHash, ...rest } = c;
  return rest;
}

export function publicGovtUser(u: GovtUser) {
  const { passwordHash: _passwordHash, ...rest } = u;
  return rest;
}
