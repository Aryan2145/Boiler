import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { OFFICER_ROLES } from './create-govt-user.dto';
import type { OfficerRole } from './create-govt-user.dto';

export class UpdateGovtUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty.' })
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsIn(OFFICER_ROLES, {
    message: 'Role must be Director, Deputy Director or Assistant Director.',
  })
  role?: OfficerRole;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9+\-() ]{7,20}$/, {
    message: 'Phone must be a valid phone number.',
  })
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'A valid email address is required.' })
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Zone cannot be empty.' })
  @MaxLength(120)
  zone?: string;

  /** Optional — when provided, replaces the user's password. */
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  @MaxLength(72)
  password?: string;
}
