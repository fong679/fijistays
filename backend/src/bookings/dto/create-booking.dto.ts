import { IsUUID, IsDateString, IsInt, Min, Max, IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'uuid-of-experience' })
  @IsUUID()
  experienceId: string;

  @ApiProperty({ example: '2025-08-15' })
  @IsDateString()
  bookingDate: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  @Max(50)
  guestCount: number;

  @ApiPropertyOptional({ example: 'We have a vegetarian in our group' })
  @IsOptional()
  @IsString()
  specialRequests?: string;

  @ApiPropertyOptional({ description: 'Array of cultural protocol IDs acknowledged' })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  protocolAcks?: string[];
}
