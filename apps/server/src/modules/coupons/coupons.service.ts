import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { CouponScope, DiscountType } from '@prisma/client';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(filters: { isActive?: boolean; scope?: CouponScope } = {}) {
    return this.prisma.coupon.findMany({
      where: {
        ...(filters.isActive !== undefined
          ? { isActive: filters.isActive }
          : {}),
        ...(filters.scope ? { scope: filters.scope } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getByCode(code: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async validate(code: string, userId: string, purchaseAmount: number) {
    const coupon = await this.getByCode(code);
    const now = new Date();

    if (!coupon.isActive) throw new BadRequestException('Coupon is inactive');
    if (coupon.validFrom > now)
      throw new BadRequestException('Coupon is not yet valid');
    if (coupon.validUntil && coupon.validUntil < now) {
      throw new BadRequestException('Coupon has expired');
    }
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }
    if (purchaseAmount < coupon.minPurchase) {
      throw new BadRequestException(
        `Minimum purchase of $${coupon.minPurchase} required`,
      );
    }

    const userRedemptions = await this.prisma.couponRedemption.count({
      where: { couponId: coupon.id, userId },
    });
    if (userRedemptions >= coupon.perUserLimit) {
      throw new BadRequestException('You have already used this coupon');
    }

    const discount = this.calculateDiscount(
      coupon.discountType,
      coupon.discountValue,
      purchaseAmount,
      coupon.maxDiscount,
    );
    return { coupon, discount, finalAmount: purchaseAmount - discount };
  }

  async redeem(
    couponId: string,
    userId: string,
    bookingId: string | undefined,
    purchaseAmount: number,
  ) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id: couponId },
    });
    if (!coupon) throw new NotFoundException('Coupon not found');

    const validation = await this.validate(coupon.code, userId, purchaseAmount);

    return this.prisma.$transaction(async (tx) => {
      const redemption = await tx.couponRedemption.create({
        data: {
          couponId,
          userId,
          bookingId,
          discountAmount: validation.discount,
        },
      });

      await tx.coupon.update({
        where: { id: couponId },
        data: { usageCount: { increment: 1 } },
      });

      return redemption;
    });
  }

  async create(data: {
    code: string;
    description?: string;
    discountType: DiscountType;
    discountValue: number;
    scope?: CouponScope;
    scopeId?: string;
    minPurchase?: number;
    maxDiscount?: number;
    usageLimit?: number;
    perUserLimit?: number;
    validUntil?: Date;
  }) {
    const code = data.code.toUpperCase();
    const existing = await this.prisma.coupon.findUnique({ where: { code } });
    if (existing) throw new ConflictException('Coupon code already exists');

    return this.prisma.coupon.create({
      data: {
        code,
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        scope: data.scope ?? 'GLOBAL',
        scopeId: data.scopeId,
        minPurchase: data.minPurchase ?? 0,
        maxDiscount: data.maxDiscount,
        usageLimit: data.usageLimit,
        perUserLimit: data.perUserLimit ?? 1,
        validUntil: data.validUntil,
      },
    });
  }

  async deactivate(id: string) {
    return this.prisma.coupon.update({
      where: { id },
      data: { isActive: false },
    });
  }

  private calculateDiscount(
    type: DiscountType,
    value: number,
    amount: number,
    maxDiscount?: number | null,
  ): number {
    let discount = type === 'PERCENTAGE' ? (amount * value) / 100 : value;
    if (maxDiscount != null) discount = Math.min(discount, maxDiscount);
    return Math.max(0, Math.min(discount, amount));
  }
}
