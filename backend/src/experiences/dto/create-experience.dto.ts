// dto/create-experience.dto.ts
import { IsString, IsNumber, IsEnum, IsBoolean, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExperienceType } from '@prisma/client';

export class CreateExperienceDto {
  @ApiProperty()
  @IsUUID()
  villageId: string;

  @ApiProperty({ example: 'Traditional Kava Ceremony & Village Tour' })
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: ExperienceType })
  @IsEnum(ExperienceType)
  type: ExperienceType;

  @ApiProperty({ example: 85.0, description: 'Price in FJD per person' })
  @IsNumber()
  @Min(1)
  pricePerPerson: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(1)
  maxGuests: number;

  @ApiProperty({ example: 3.5, description: 'Duration in hours' })
  @IsNumber()
  @Min(0.5)
  durationHours: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  includesFood?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  includesTransfer?: boolean;
}
