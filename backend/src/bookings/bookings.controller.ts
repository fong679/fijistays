import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private bookings: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking (with optimistic locking)' })
  create(@Request() req, @Body() dto: CreateBookingDto) {
    return this.bookings.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings for current user' })
  findAll(@Request() req) {
    return this.bookings.findAllForUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single booking' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.bookings.findOne(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a booking' })
  cancel(@Param('id') id: string, @Request() req) {
    return this.bookings.cancel(id, req.user.id);
  }
}
