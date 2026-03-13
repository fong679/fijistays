import { Controller, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @Post('intent/:bookingId')
  @ApiOperation({ summary: 'Create a Stripe payment intent for a booking' })
  createIntent(@Param('bookingId') bookingId: string, @Request() req) {
    return this.payments.createPaymentIntent(bookingId, req.user.id);
  }

  @Post('confirm/:bookingId')
  @ApiOperation({ summary: 'Confirm payment (called by webhook in production)' })
  confirm(@Param('bookingId') bookingId: string, @Body() body: { providerRef: string }) {
    return this.payments.confirmPayment(bookingId, body.providerRef);
  }
}
