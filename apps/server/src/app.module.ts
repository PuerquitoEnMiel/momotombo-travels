import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeminiAgentModule } from './infrastructure/gemini-agent/gemini-agent.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { DestinationsModule } from './modules/destinations/destinations.module';
import { ItinerariesModule } from './modules/itineraries/itineraries.module';
import { PineconeModule } from './infrastructure/pinecone/pinecone.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { StripeModule } from './infrastructure/stripe/stripe.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
