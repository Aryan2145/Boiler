import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { JwtPayload } from '../auth.service';

/** Allows only the government admin. Must run after JwtAuthGuard. */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    const user = request.user;
    if (user?.type === 'govt' && user.role === 'ADMIN') return true;
    throw new ForbiddenException('Administrator access required.');
  }
}
