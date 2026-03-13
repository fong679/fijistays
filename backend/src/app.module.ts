import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VillagesModule } from './villages/villages.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    // ── Config ──────────────────────────────────────────
    ConfigModule.forRoot({ isGlobal: true }),

    // ── Rate limiting ────────────────────────────────────
    ThrottlerModule.forRoot([
      { name: 'default', ttl: 60000, limit: 100 },
      { name: 'auth',    ttl: 60000, limit: 10  }, // stricter for auth endpoints
    ]),

    // ── Infrastructure ───────────────────────────────────
    PrismaModule,
    RedisModule,

    // ── Feature modules ──────────────────────────────────
    AuthModule,
    UsersModule,
    VillagesModule,
    ExperiencesModule,
    BookingsModule,
    PaymentsModule,
  ],
})
export class AppModule {}
