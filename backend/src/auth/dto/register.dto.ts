import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'sione@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Sione' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Taufa' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: '+6799123456' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: [UserRole.TOURIST, UserRole.HOST] })
  @IsOptional()
  @IsEnum([UserRole.TOURIST, UserRole.HOST])
  role?: UserRole;
}
