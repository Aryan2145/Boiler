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

export const OFFICER_ROLES = [
  'DIRECTOR',
  'DEPUTY_DIRECTOR',
  'ASSISTANT_DIRECTOR',
] as const;

export type OfficerRole = (typeof OFFICER_ROLES)[number];

export class CreateGovtUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required.' })
  @MaxLength(120)
  name: string;

  @IsIn(OFFICER_ROLES, {
    message: 'Role must be Director, Deputy Director or Assistant Director.',
  })
  role: OfficerRole;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required.' })
  @Matches(/^[0-9+\-() ]{7,20}$/, {
    message: 'Phone must be a valid phone number.',
  })
  phone: string;

  @IsEmail({}, { message: 'A valid email address is required.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Zone is required.' })
  @MaxLength(120)
  zone: string;

  /** Optional initial password; defaults to Officer@123 until an invite flow exists. */
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  @MaxLength(72)
  password?: string;
}
