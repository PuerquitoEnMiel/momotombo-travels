import { PrismaClient } from '@prisma/client';

export interface AmenitySeed {
  name: string;
  icon: string;
}

export const amenities: AmenitySeed[] = [
  { name: 'Estacionamiento', icon: 'car' },
  { name: 'WiFi', icon: 'wifi' },
  { name: 'Restaurante', icon: 'restaurant' },
  { name: 'Guías certificados', icon: 'compass' },
  { name: 'Transporte incluido', icon: 'bus' },
  { name: 'Mirador', icon: 'binoculars' },
  { name: 'Baños', icon: 'toilet' },
  { name: 'Accesibilidad', icon: 'wheelchair' },
  { name: 'Tienda de souvenirs', icon: 'shopping-bag' },
  { name: 'Hospedaje', icon: 'bed' },
  { name: 'Camping', icon: 'tent' },
  { name: 'Señalización de senderos', icon: 'signpost' },
  { name: 'Primeros auxilios', icon: 'first-aid' },
  { name: 'Guardarropa', icon: 'archive' },
  { name: 'Vestidores', icon: 'tshirt' },
  { name: 'Área infantil', icon: 'baby' },
  { name: 'Pet-friendly', icon: 'paw-print' },
  { name: 'Centro de información', icon: 'info' },
];

export async function seedAmenities(prisma: PrismaClient): Promise<void> {
  console.log('🧩 Seeding amenities...');
  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { name: amenity.name },
      update: {},
      create: amenity,
    });
  }
  console.log(`  ✅ ${amenities.length} amenities created`);
}
