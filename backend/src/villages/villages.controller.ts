import { Controller, Get, Post, Param, Body, UseGuards, Request, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VillagesService } from './villages.service';
import { CreateVillageDto } from './dto/create-village.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('villages')
@Controller('villages')
export class VillagesController {
  constructor(private villages: VillagesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST, UserRole.ADMIN)
  @ApiOperation({ summary: 'Register a village (hosts only)' })
  create(@Request() req, @Body() dto: CreateVillageDto) {
    return this.villages.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all active verified villages' })
  findAll(@Query('islandGroup') islandGroup?: string) {
    return this.villages.findAll({ islandGroup, verified: true });
  }

  @Get('my')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get villages owned by current host' })
  myVillages(@Request() req) {
    return this.villages.findByHost(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a village with full details' })
  findOne(@Param('id') id: string) {
    return this.villages.findOne(id);
  }

  @Patch(':id/verify')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Admin: verify a village listing' })
  verify(@Param('id') id: string, @Request() req) {
    return this.villages.verify(id, req.user.id);
  }
}
