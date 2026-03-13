import { Controller, Get, Post, Param, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('experiences')
@Controller('experiences')
export class ExperiencesController {
  constructor(private experiences: ExperiencesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST, UserRole.ADMIN)
  create(@Request() req, @Body() dto: CreateExperienceDto) {
    return this.experiences.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Browse all experiences' })
  findAll(
    @Query('type') type?: string,
    @Query('maxPrice') maxPrice?: number,
  ) {
    return this.experiences.findAll({ type, maxPrice });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get experience detail with availability' })
  findOne(@Param('id') id: string) {
    return this.experiences.findOne(id);
  }

  @Post(':id/availability/seed')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST, UserRole.ADMIN)
  @ApiOperation({ summary: 'Seed 90 days of availability for an experience' })
  seedAvailability(@Param('id') id: string, @Request() req) {
    return this.experiences.seedAvailability(id, req.user.id);
  }
}
