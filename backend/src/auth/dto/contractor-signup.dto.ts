import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ContractorSignupDto {
  @IsString()
  @IsNotEmpty({ message: 'Full name is required.' })
  @MaxLength(120)
  fullName: string;

  @IsString()
  @IsNotEmpty({ message: 'License number is required.' })
  @MaxLength(60)
  licenseNo: string;

  @IsString()
  @IsNotEmpty({ message: 'Company name is required.' })
  @MaxLength(160)
  companyName: string;

  @IsString()
  @IsNotEmpty({ message: 'Company address is required.' })
  @MaxLength(400)
  companyAddress: string;

  @IsString()
  @IsNotEmpty({ message: 'Telephone is required.' })
  @Matches(/^[0-9+\-() ]{7,20}$/, {
    message: 'Telephone must be a valid phone number.',
  })
  telephone: string;

  @IsEmail({}, { message: 'A valid email address is required.' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  @MaxLength(72)
  password: string;
}
