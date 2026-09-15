import { PrismaClient } from '@prisma/client';

export interface DepartmentSeed {
  name: string;
  slug: string;
  isoCode: string;
  type: 'DEPARTMENT' | 'AUTONOMOUS_REGION';
  capital: string;
  description: string;
}

export const departments: DepartmentSeed[] = [
  {
    name: 'Boaco',
    slug: 'boaco',
    isoCode: 'NI-BO',
    type: 'DEPARTMENT',
    capital: 'Boaco',
    description:
      'Tierra de Los Novios. Paisajes montañosos, cascadas y tradiciones ancestrales en el corazón de Nicaragua.',
  },
  {
    name: 'Carazo',
    slug: 'carazo',
    isoCode: 'NI-CA',
    type: 'DEPARTMENT',
    capital: 'Diriamba',
    description:
      'Cuna de la Gritería y el Santo Domingo. Volcanes, lagunas y artesanías en la cordillera central.',
  },
  {
    name: 'Chinandega',
    slug: 'chinandega',
    isoCode: 'NI-CI',
    type: 'DEPARTMENT',
    capital: 'Chinandega',
    description:
      'La Puerta del Sol de Occidente. Volcanes activos, playas del Pacífico y la ruta del cacao.',
  },
  {
    name: 'Chontales',
    slug: 'chontales',
    isoCode: 'NI-CT',
    type: 'DEPARTMENT',
    capital: 'Juigalpa',
    description:
      'Tierra ganadera con petroglifos precolombinos, ríos cristalinos y la Reserva Indio Maíz.',
  },
  {
    name: 'Estelí',
    slug: 'esteli',
    isoCode: 'NI-ES',
    type: 'DEPARTMENT',
    capital: 'Estelí',
    description:
      'La Suiza de Nicaragua. Bosques nubosos, cascadas y la Reserva Natural Miraflor.',
  },
  {
    name: 'Granada',
    slug: 'granada',
    isoCode: 'NI-GR',
    type: 'DEPARTMENT',
    capital: 'Granada',
    description:
      'La Gran Sultana. Joya colonial a orillas del Lago Cocibolca con volcán Mombacho y 365 isletas.',
  },
  {
    name: 'Jinotega',
    slug: 'jinotega',
    isoCode: 'NI-JI',
    type: 'DEPARTMENT',
    capital: 'Jinotega',
    description:
      'La Ciudad de las Nubes. Bosques de pino, Café Negrito y el Cerro Mogotón.',
  },
  {
    name: 'León',
    slug: 'leon',
    isoCode: 'NI-LE',
    type: 'DEPARTMENT',
    capital: 'León',
    description:
      'Ciudad universitaria y revolucionaria. Catedral neoclásica, volcanes y murales históricos.',
  },
  {
    name: 'Madriz',
    slug: 'madriz',
    isoCode: 'NI-MD',
    type: 'DEPARTMENT',
    capital: 'Somoto',
    description:
      'Hogar del Cañón de Somoto. Paisajes abruptos, tradiciones indígenas y caficultura.',
  },
  {
    name: 'Managua',
    slug: 'managua',
    isoCode: 'NI-MN',
    type: 'DEPARTMENT',
    capital: 'Managua',
    description:
      'Capital de Nicaragua. Lago Xolotlán, Parque Lomas de Tiscapa y vida urbana vibrante.',
  },
  {
    name: 'Masaya',
    slug: 'masaya',
    isoCode: 'NI-MS',
    type: 'DEPARTMENT',
    capital: 'Masaya',
    description:
      'La Ciudad de las Flores. Volcán Masaya, mercados de artesanías y la Laguna de Apoyo.',
  },
  {
    name: 'Matagalpa',
    slug: 'matagalpa',
    isoCode: 'NI-MT',
    type: 'DEPARTMENT',
    capital: 'Matagalpa',
    description:
      'Tierra del café y las montañas. Selva Negra, Cascada de Tisatoya y bosques nubosos.',
  },
  {
    name: 'Nueva Segovia',
    slug: 'nueva-segovia',
    isoCode: 'NI-NS',
    type: 'DEPARTMENT',
    capital: 'Ocotal',
    description:
      'Frontera norte con Honduras. Montañas, café y la Fortaleza de San Fernando.',
  },
  {
    name: 'Río San Juan',
    slug: 'rio-san-juan',
    isoCode: 'NI-SJ',
    type: 'DEPARTMENT',
    capital: 'San Carlos',
    description:
      'Ruta del Conquistador. Reserva Indio Maíz, El Castillo y el Lago Cocibolca.',
  },
  {
    name: 'Rivas',
    slug: 'rivas',
    isoCode: 'NI-RI',
    type: 'DEPARTMENT',
    capital: 'Rivas',
    description:
      'Puerta al Pacífico. San Juan del Sur, Isla de Ometepe y las playas de surf.',
  },
  {
    name: 'RACCN',
    slug: 'raccn',
    isoCode: 'NI-AN',
    type: 'AUTONOMOUS_REGION',
    capital: 'Bilwi (Puerto Cabezas)',
    description:
      'Costa Caribe Norte. Comunidades Miskitas, Coco River y playas vírgenes del Caribe.',
  },
  {
    name: 'RACCS',
    slug: 'raccs',
    isoCode: 'NI-AS',
    type: 'AUTONOMOUS_REGION',
    capital: 'Bluefields',
    description:
      'Costa Caribe Sur. Corn Island, Laguna de Perlas y cultura afrocaribeña.',
  },
];

export async function seedDepartments(prisma: PrismaClient): Promise<void> {
  console.log('🌎 Seeding departments...');
  for (const dept of departments) {
    await prisma.department.upsert({
      where: { slug: dept.slug },
      update: {},
      create: dept,
    });
  }
  console.log(`  ✅ ${departments.length} departments/regions created`);
}
