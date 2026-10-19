import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { CouponScope, DiscountType } from '@prisma/client';

// Un unico error generico para cualquier fallo del cupon, evitando
// enumeracion de codigos (no distingue inexistente vs expirado/inactivo).
const GENERIC_COUPON_ERROR = 'Coupon is invalid or no longer available';

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
    if (!coupon) throw new BadRequestException(GENERIC_COUPON_ERROR);
    return coupon;
  }

  async validate(code: string, userId: string, purchaseAmount: number) {
    if (!userId) {
      throw new BadRequestException('An authenticated user is required');
    }

    const coupon = await this.getByCode(code);
    const now = new Date();

    if (
      !coupon.isActive ||
      coupon.validFrom > now ||
      (coupon.validUntil && coupon.validUntil < now) ||
      (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit)
    ) {
      throw new BadRequestException(GENERIC_COUPON_ERROR);
    }
    if (
      coupon.discountType === 'PERCENTAGE' &&
      Number(coupon.discountValue) > 100
    ) {
      throw new BadRequestException('Coupon percentage cannot exceed 100');
    }
    if (purchaseAmount < Number(coupon.minPurchase)) {
      throw new BadRequestException(
        `Minimum purchase of $${Number(coupon.minPurchase)} required`,
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
      Number(coupon.discountValue),
      purchaseAmount,
      coupon.maxDiscount != null ? Number(coupon.maxDiscount) : null,
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
    if (!coupon) throw new BadRequestException(GENERIC_COUPON_ERROR);

    const validation = await this.validate(coupon.code, userId, purchaseAmount);

    return this.prisma.$transaction(async (tx) => {
      // Incremento atomico condicionado al limite de uso: si otro proceso
      // agoto el cupon, count === 0 y la transaccion se revierte.
      const updated = await tx.coupon.updateMany({
        where: {
          id: couponId,
          ...(coupon.usageLimit != null
            ? { usageCount: { lt: coupon.usageLimit } }
            : {}),
        },
        data: { usageCount: { increment: 1 } },
      });

      if (updated.count === 0) {
        throw new BadRequestException(GENERIC_COUPON_ERROR);
      }

      return tx.couponRedemption.create({
        data: {
          couponId,
          userId,
          bookingId,
          discountAmount: validation.discount,
        },
      });
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
    let discount =
      type === 'PERCENTAGE'
        ? (amount * Math.min(Math.max(value, 0), 100)) / 100
        : value;
    if (maxDiscount != null) discount = Math.min(discount, maxDiscount);
    return Math.max(0, Math.min(discount, amount));
  }
}
