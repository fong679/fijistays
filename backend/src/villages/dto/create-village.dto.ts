// dto/create-village.dto.ts
import { IsString, IsNumber, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IslandGroup } from '@prisma/client';

export class CreateVillageDto {
  @ApiProperty({ example: 'Navala Village' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: IslandGroup })
  @IsEnum(IslandGroup)
  islandGroup: IslandGroup;

  @ApiProperty({ example: 'Viti Levu' })
  @IsString()
  island: string;

  @ApiPropertyOptional({ example: 'Ba Province' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiProperty({ example: -17.5 })
  @IsNumber()
  @Min(-90) @Max(90)
  latitude: number;

  @ApiProperty({ example: 177.6 })
  @IsNumber()
  @Min(-180) @Max(180)
  longitude: number;

  @ApiPropertyOptional({ description: 'URL to uploaded TLTB permit document' })
  @IsOptional()
  @IsString()
  tltbPermitUrl?: string;
}
