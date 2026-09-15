import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { validateEnv } from './config/env.validation';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { GeminiAgentModule } from './infrastructure/gemini-agent/gemini-agent.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { PineconeModule } from './infrastructure/pinecone/pinecone.module';
import { StripeModule } from './infrastructure/stripe/stripe.module';

import { AuthModule } from './modules/auth/auth.module';
import { DestinationsModule } from './modules/destinations/destinations.module';
import { ItinerariesModule } from './modules/itineraries/itineraries.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { UploadModule } from './modules/upload/upload.module';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { HealthModule } from './health/health.module';
import { CommentsModule } from './modules/comments/comments.module';
import { TagsModule } from './modules/tags/tags.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { SearchModule } from './modules/search/search.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuditModule } from './modules/audit/audit.module';
// import { LoggingModule } from './infrastructure/logging';
// import { MetricsModule } from './infrastructure/metrics';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv,
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TTL_MS', 60000),
          limit: config.get<number>('THROTTLE_LIMIT', 20),
        },
      ],
    }),
    GeminiAgentModule,
    PrismaModule,
    AuthModule,
    DestinationsModule,
    ItinerariesModule,
    BookingsModule,
    ReviewsModule,
    BlogsModule,
    GamificationModule,
    StripeModule,
    UploadModule,
    PineconeModule,
    HealthModule,
    CommentsModule,
    TagsModule,
    CategoriesModule,
    CouponsModule,
    SearchModule,
    AdminModule,
    AuditModule,
    // LoggingModule,
    // MetricsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
