import { PrismaClient } from '@prisma/client';

export interface CategorySeed {
  name: string;
  slug: string;
  description: string;
}

export const categories: CategorySeed[] = [
  {
    name: 'Volcanes',
    slug: 'volcanes',
    description:
      'Tierra de fuego y lava. Los volcanes más activos de Centroamérica.',
  },
  {
    name: 'Playas',
    slug: 'playas',
    description: 'Sol, arena y surf. Costas del Pacífico y el Caribe.',
  },
  {
    name: 'Islas',
    slug: 'islas',
    description: 'Paraísos tropicales en lagos y mares.',
  },
  {
    name: 'Ciudades Coloniales',
    slug: 'colonial',
    description: 'Historia, arquitectura y cultura en calles empedradas.',
  },
  {
    name: 'Reservas Naturales',
    slug: 'reservas',
    description:
      'Biodiversidad protegida, bosques nubosos y selvas tropicales.',
  },
  {
    name: 'Lagos & Lagunas',
    slug: 'lagos',
    description: 'Aguas cristalinas en el corazón de Nicaragua.',
  },
  {
    name: 'Arqueología',
    slug: 'arqueologia',
    description: 'Petroglifos, figuras serpentinas y sitios precolombinos.',
  },
  {
    name: 'Ruta del Café',
    slug: 'cafe',
    description: 'Fincas cafetaleras, catas y paisajes de montaña.',
  },
  {
    name: 'Aventura',
    slug: 'aventura',
    description: 'Senderismo, canopy, sandboarding y adrenalina pura.',
  },
  {
    name: 'Cultura & Gastronomía',
    slug: 'cultura',
    description: 'Tradiciones, mercados, artesanías y sabores locales.',
  },
];

export async function seedCategories(prisma: PrismaClient): Promise<void> {
  console.log('📂 Seeding categories...');
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`  ✅ ${categories.length} categories created`);
}
