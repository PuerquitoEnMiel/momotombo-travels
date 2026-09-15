import { config } from 'dotenv';
config({ path: '../.env' });

import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { seedDepartments } from './departments';
import { seedCategories } from './categories';
import { seedAmenities } from './amenities';
import { destinationsData } from './destinations';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting comprehensive Nicaragua seed...\n');

  // 1. Clean
  console.log('🧹 Cleaning database...');
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.emailVerificationToken.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.oAuthAccount.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.itineraryItem.deleteMany();
  await prisma.itineraryDay.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.destinationImage.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.municipality.deleteMany();
  await prisma.department.deleteMany();
  await prisma.category.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  console.log('  ✅ Database cleaned\n');

  // 2. Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@momotombo.com',
      password: hashedPassword,
      name: 'Admin Momotombo',
      role: UserRole.ADMIN,
      profile: {
        create: {
          bio: 'Administrador del sistema',
          preferences: { theme: 'dark' },
        },
      },
    },
  });
  console.log(`👤 Created Admin: ${admin.email}\n`);

  // 3. Geography
  await seedDepartments(prisma);

  // 4. Categories
  await seedCategories(prisma);

  // 5. Amenities
  await seedAmenities(prisma);

  // 6. Destinations + Activities + Images
  console.log('🏖️  Seeding destinations...');
  let destCount = 0;
  let actCount = 0;
  let imgCount = 0;

  // Get all departments and categories for slug→id mapping
  const departments = await prisma.department.findMany();
  const categories = await prisma.category.findMany();
  const amenities = await prisma.amenity.findMany();

  const deptMap = new Map(departments.map((d) => [d.slug, d.id]));
  const catMap = new Map(categories.map((c) => [c.slug, c.id]));
  const amenityMap = new Map(amenities.map((a) => [a.name, a.id]));

  for (const dest of destinationsData) {
    const departmentId = deptMap.get(dest.departmentSlug);
    const categoryId = catMap.get(dest.categorySlug);

    if (!departmentId || !categoryId) {
      console.warn(
        `  ⚠️  Skipping ${dest.name}: dept=${dest.departmentSlug} cat=${dest.categorySlug}`,
      );
      continue;
    }

    await prisma.destination.create({
      data: {
        name: dest.name,
        slug: dest.slug,
        description: dest.description,
        location: dest.location,
        priceLevel: dest.priceLevel,
        rating: dest.rating,
        isFeatured: dest.isFeatured,
        departmentId,
        categoryId,
        images: {
          create: dest.images.map((img) => ({
            url: img.url,
            altText: img.altText,
            isHero: img.isHero,
          })),
        },
        activities: {
          create: dest.activities.map((act) => ({
            name: act.name,
            description: act.description,
            price: act.price,
            duration: act.duration,
            difficulty: act.difficulty,
            included: act.included,
            toBring: act.toBring,
          })),
        },
        amenities: {
          connect: dest.amenityNames
            .map((name) => amenityMap.get(name))
            .filter(Boolean)
            .map((id) => ({ id: id! })),
        },
      },
    });

    destCount++;
    actCount += dest.activities.length;
    imgCount += dest.images.length;
  }

  console.log(`  ✅ ${destCount} destinations created`);
  console.log(`  ✅ ${actCount} activities created`);
  console.log(`  ✅ ${imgCount} images created\n`);

  // Summary
  const totalDest = await prisma.destination.count();
  const totalAct = await prisma.activity.count();
  const totalDept = await prisma.department.count();
  const totalCat = await prisma.category.count();
  const totalAmen = await prisma.amenity.count();

  console.log('═══════════════════════════════════════');
  console.log('  📊 SEED SUMMARY');
  console.log('═══════════════════════════════════════');
  console.log(`  Departments/Regions: ${totalDept}`);
  console.log(`  Categories:          ${totalCat}`);
  console.log(`  Amenities:           ${totalAmen}`);
  console.log(`  Destinations:        ${totalDest}`);
  console.log(`  Activities:          ${totalAct}`);
  console.log('═══════════════════════════════════════');
  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
