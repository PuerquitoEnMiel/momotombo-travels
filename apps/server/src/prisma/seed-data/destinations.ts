export const destinationsData = [
  // ==========================================
  // BOACO
  // ==========================================
  {
    name: 'Boaco',
    slug: 'boaco',
    description:
      "La ciudad de Boaco, conocida como 'La Ciudad de las Colinas', offre una arquitectura colonial única distribuida en siete colinas con vistas panorámicas impresionantes del valle circundante.",
    location: {
      lat: 12.4722,
      lng: -85.6614,
      address: 'Boaco, Boaco, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.2,
    isFeatured: false,
    categorySlug: 'colonial',
    departmentSlug: 'boaco',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518182170546-076650f4443e?w=800&h=600&fit=crop',
        altText: 'Vista panorámica de Boaco desde una de sus colinas',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Recorrido por el Centro Histórico',
        description:
          'Caminata guiada por las siete colinas de Boaco visitando iglesias coloniales y miradores naturales.',
        price: 10,
        duration: 120,
        difficulty: 'EASY',
        included: ['guia'],
        toBring: ['agua', 'calzado cómodo'],
      },
      {
        name: 'Visita al Mirador La7',
        description:
          'Visita al mirador natural con la mejor vista panorámica de la ciudad y sus alrededores.',
        price: 5,
        duration: 60,
        difficulty: 'EASY',
        included: [],
        toBring: ['agua', 'protector solar'],
      },
    ],
    amenityNames: [
      'Restaurante',
      'Baños',
      'Estacionamiento',
      'Tienda de souvenirs',
    ],
  },
  {
    name: 'Reserva El Jaguar',
    slug: 'reserva-el-jaguar',
    description:
      'Reserva natural privada en Boaco con bosques nublados, avistamiento de aves y senderos ecológicos que atraviesan ecosistemas únicos de la region central de Nicaragua.',
    location: {
      lat: 12.55,
      lng: -85.72,
      address: 'Boaco, Boaco, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.3,
    isFeatured: false,
    categorySlug: 'reservas',
    departmentSlug: 'boaco',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
        altText: 'Bosque nublado en la Reserva El Jaguar',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Senderismo Ecológico',
        description:
          'Recorrido por senderos de dificultad media con observación de flora y fauna local.',
        price: 15,
        duration: 180,
        difficulty: 'MODERATE',
        included: ['guia', 'equipo básico'],
        toBring: ['agua', 'repelente', 'binoculares'],
      },
      {
        name: 'Avistamiento de Aves',
        description:
          'Tour especializado con guía experto para observar más de 150 especies de aves tropicales.',
        price: 25,
        duration: 240,
        difficulty: 'EASY',
        included: ['guía certificado', 'binoculares'],
        toBring: ['agua', 'protector solar', 'ropa de camuflaje'],
      },
    ],
    amenityNames: [
      'Guías certificados',
      'Señalización de senderos',
      'Primeros auxilios',
    ],
  },

  // ==========================================
  // CARAZO
  // ==========================================
  {
    name: 'Mercado de Masaya',
    slug: 'mercado-de-masaya',
    description:
      'El mercado indigenous más importante de Nicaragua, donde se encuentran artesanías, textiles, cerámicas y productos típicos de todas las regiones del país.',
    location: {
      lat: 11.9841,
      lng: -86.0951,
      address: 'Masaya, Masaya, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.4,
    isFeatured: true,
    categorySlug: 'cultura',
    departmentSlug: 'carazo',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
        altText: 'Artesanías coloridas en el Mercado de Masaya',
        isHero: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
        altText: 'Productos locales y comida típica en el mercado',
        isHero: false,
      },
    ],
    activities: [
      {
        name: 'Recorrido Cultural por el Mercado',
        description:
          'Tour guiado por los puestos del mercado aprendiendo sobre artesanías y tradiciones nicaragüenses.',
        price: 8,
        duration: 90,
        difficulty: 'EASY',
        included: ['guía local'],
        toBring: ['efectivo', 'bolsa para compras'],
      },
      {
        name: 'Taller de Artesanías',
        description:
          'Aprende a crear tu propia artesanía con artesanos locales del mercado.',
        price: 20,
        duration: 120,
        difficulty: 'EASY',
        included: ['materiales', 'guía'],
        toBring: ['creatividad'],
      },
    ],
    amenityNames: [
      'Restaurante',
      'Tienda de souvenirs',
      'Baños',
      'Señalización',
    ],
  },
  {
    name: 'Catarina',
    slug: 'catarina',
    description:
      'Pueblo artesanal en las alturas con el mirador más fotografiado de Nicaragua, ofreciendo vistas espectaculares de la Laguna de Apoyo y el Volcán Mombacho.',
    location: {
      lat: 11.9167,
      lng: -86.0667,
      address: 'Catarina, Masaya, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.6,
    isFeatured: true,
    categorySlug: 'colonial',
    departmentSlug: 'carazo',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        altText: 'Vista panorámica de Catarina sobre la Laguna de Apoyo',
        isHero: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
        altText: 'Jardines de viveros en Catarina',
        isHero: false,
      },
    ],
    activities: [
      {
        name: 'Visita al Mirador de Catarina',
        description:
          'Disfruta de la vista más icónica de la Laguna de Apoyo desde este mirador natural a 520 metros de altura.',
        price: 3,
        duration: 45,
        difficulty: 'EASY',
        included: [],
        toBring: ['cámara', 'protector solar'],
      },
      {
        name: 'Recorrido por Viveros',
        description:
          "Tour por los viveros de plantas ornamentales y tropicales del pueblo, conocido como la 'Ciudad de las Flores'.",
        price: 10,
        duration: 60,
        difficulty: 'EASY',
        included: ['guía local'],
        toBring: ['agua'],
      },
    ],
    amenityNames: [
      'Restaurante',
      'Estacionamiento',
      'Tienda de souvenirs',
      'Mirador',
    ],
  },
  {
    name: 'San Juan de Oriente',
    slug: 'san-juan-de-oriente',
    description:
      'Pueblo de artesanos ceramistas de la ruta de los Pueblos Blancos, famoso por su cerámica de alta calidad y tradición alfarera que data de tiempos precolombinos.',
    location: {
      lat: 11.9053,
      lng: -86.0747,
      address: 'San Juan de Oriente, Masaya, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.3,
    isFeatured: false,
    categorySlug: 'cultura',
    departmentSlug: 'carazo',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop',
        altText: 'Artesano moldeando cerámica en San Juan de Oriente',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Taller de Cerámica',
        description:
          'Aprende las técnicas ancestrales de alfarería con artesanos locales.',
        price: 15,
        duration: 120,
        difficulty: 'EASY',
        included: ['materiales', 'guía'],
        toBring: ['ropa que se pueda ensuciar'],
      },
      {
        name: 'Recorrido por Talleres',
        description:
          'Visita los talleres de cerámica artesanal y observa el proceso completo de creación.',
        price: 5,
        duration: 60,
        difficulty: 'EASY',
        included: [],
        toBring: ['efectivo para compras'],
      },
    ],
    amenityNames: [
      'Tienda de souvenirs',
      'Estacionamiento',
      'Baños',
      'Accesibilidad',
    ],
  },
  {
    name: 'Laguna de Apoyo',
    slug: 'laguna-de-apoyo-carazo',
    description:
      'Lago de cráter volcánico con aguas termales naturales y la transparencia más alta de Centroamérica, perfecto para nadar y hacer kayak entre bosques tropicales.',
    location: {
      lat: 11.92,
      lng: -86.03,
      address: 'Catarina, Masaya, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.7,
    isFeatured: true,
    categorySlug: 'lagos',
    departmentSlug: 'carazo',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop',
        altText: 'Laguna de Apoyo con sus aguas azul turquesa',
        isHero: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
        altText: 'Kayak en la Laguna de Apoyo',
        isHero: false,
      },
    ],
    activities: [
      {
        name: 'Nado en Aguas Termales',
        description:
          'Disfruta de las aguas termales naturales del lago de cráter con temperaturas de 27-30°C todo el año.',
        price: 7,
        duration: 180,
        difficulty: 'EASY',
        included: ['acceso a playa', 'hamacas'],
        toBring: ['traje de baño', 'protector solar'],
      },
      {
        name: 'Kayak en la Laguna',
        description:
          'Explora las orillas del lago en kayak observando la flora y fauna del cráter volcánico.',
        price: 12,
        duration: 90,
        difficulty: 'EASY',
        included: ['kayak', 'chaleco salvavidas'],
        toBring: ['traje de baño', 'agua'],
      },
      {
        name: 'Senderismo al Cráter',
        description:
          'Caminata por los senderos del cráter con vistas espectaculares del lago desde diferentes altitudes.',
        price: 5,
        duration: 120,
        difficulty: 'MODERATE',
        included: ['guía'],
        toBring: ['agua', 'calzado deportivo', 'repelente'],
      },
    ],
    amenityNames: [
      'Restaurante',
      'Estacionamiento',
      'Baños',
      'Vestidores',
      'Guardarropa',
    ],
  },

  // ==========================================
  // CHINANDEGA
  // ==========================================
  {
    name: 'Volcán San Cristóbal',
    slug: 'volcan-san-cristobal',
    description:
      'El volcán más alto de Nicaragua con 1,745 metros, ofreciendo ascensos desafiantes y vistas que se extienden hasta el Pacífico y el Lago de Managua.',
    location: {
      lat: 12.7022,
      lng: -87.0044,
      address: 'Chinandega, Chinandega, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.5,
    isFeatured: true,
    categorySlug: 'volcanes',
    departmentSlug: 'chinandega',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1580309237429-661ea0e5add3?w=800&h=600&fit=crop',
        altText: 'Volcán San Cristóbal con su cono perfecto',
        isHero: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
        altText: 'Sendero de ascenso al Volcán San Cristóbal',
        isHero: false,
      },
    ],
    activities: [
      {
        name: 'Ascenso al Volcán',
        description:
          'Ascenso guiado de 5 horas al cráter activo con vistas panorámicas de 360 grados.',
        price: 45,
        duration: 300,
        difficulty: 'HARD',
        included: ['guía certificado', 'transporte', 'almuerzo'],
        toBring: ['agua', 'calzado de montaña', 'protector solar', 'chompa'],
      },
      {
        name: 'Observación de Amanecer',
        description:
          'Ascenso nocturno para presenciar el amanecer desde la cima del volcán más alto del país.',
        price: 55,
        duration: 360,
        difficulty: 'HARD',
        included: ['guía certificado', 'transporte', 'desayuno'],
        toBring: ['ropa de abrigo', 'linterna', 'agua', 'calzado de montaña'],
      },
    ],
    amenityNames: [
      'Guías certificados',
      'Transporte incluido',
      'Primeros auxilios',
      'Estacionamiento',
    ],
  },
  {
    name: 'Volcán Cosigüina',
    slug: 'volcan-cosiguina',
    description:
      'Volcán aislado en la península de Cosigüina con un lago de cráter de color turquesa y vistas al Golfo de Fonseca y los volcanes de Honduras y El Salvador.',
    location: {
      lat: 12.9833,
      lng: -87.5833,
      address: 'Chinandega, Chinandega, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.4,
    isFeatured: false,
    categorySlug: 'volcanes',
    departmentSlug: 'chinandega',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop',
        altText: 'Lago de cráter del Volcán Cosigüina',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Ascenso al Cráter',
        description:
          'Caminata de 4 horas hasta el cráter con impresionante lago de color turquesa en su interior.',
        price: 40,
        duration: 240,
        difficulty: 'MODERATE',
        included: ['guía', 'transporte'],
        toBring: ['agua', 'calzado deportivo', 'protector solar'],
      },
      {
        name: 'Observación del Golfo de Fonseca',
        description:
          'Tour al mirador natural con vista a tres países: Nicaragua, Honduras y El Salvador.',
        price: 35,
        duration: 180,
        difficulty: 'EASY',
        included: ['guía', 'transporte'],
        toBring: ['cámara', 'binoculares'],
      },
    ],
    amenityNames: [
      'Guías certificados',
      'Transporte incluido',
      'Primeros auxilios',
    ],
  },
  {
    name: 'Potosí',
    slug: 'potosi',
    description:
      'Pequeña población en la ribera del Lago de Managua con acceso a playas volcánicas y vistas del Volcán Momotombo en el horizonte.',
    location: {
      lat: 12.7167,
      lng: -86.8667,
      address: 'Chinandega, Chinandega, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.1,
    isFeatured: false,
    categorySlug: 'playas',
    departmentSlug: 'chinandega',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        altText: 'Playa de Potosí con vista al Volcán Momotombo',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Paseo en Bote por el Lago',
        description:
          'Recorrido en lancha por el Lago de Managua con vista a los volcanes circundantes.',
        price: 15,
        duration: 90,
        difficulty: 'EASY',
        included: ['bote', 'chaleco salvavidas'],
        toBring: ['agua', 'protector solar'],
      },
      {
        name: 'Pesca Deportiva',
        description:
          'Jornada de pesca en el Lago de Managua con pescadores locales.',
        price: 25,
        duration: 180,
        difficulty: 'EASY',
        included: ['equipo de pesca', 'bote', 'guía'],
        toBring: ['sombrero', 'agua', 'comida'],
      },
    ],
    amenityNames: ['Restaurante', 'Estacionamiento', 'Baños'],
  },

  // ==========================================
  // CHONTALES
  // ==========================================
  {
    name: 'Juigalpa',
    slug: 'juigalpa',
    description:
      'Capital de Chontales rodeada de rancherías ganaderas y formaciones rocosas volcánicas, conocida por su tradición vaquera y la Feria de la Yegua.',
    location: {
      lat: 12.1011,
      lng: -85.3656,
      address: 'Juigalpa, Chontales, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.0,
    isFeatured: false,
    categorySlug: 'colonial',
    departmentSlug: 'chontales',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&h=600&fit=crop',
        altText: 'Paisaje ganadero alrededor de Juigalpa',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Tour Vaquero',
        description:
          'Experiencia en hacienda ganadera con jinetes locales aprendiendo sobre la cultura vaquera chontaleña.',
        price: 20,
        duration: 180,
        difficulty: 'EASY',
        included: ['guía', 'transporte'],
        toBring: ['calzado cerrado', 'sombrero'],
      },
      {
        name: 'Visita a Tolas Precolombinas',
        description:
          'Recorrido arqueológico por las tumbas de piedra volcánica de la cultura Chontal.',
        price: 10,
        duration: 120,
        difficulty: 'EASY',
        included: ['guía local'],
        toBring: ['agua', 'calzado deportivo'],
      },
    ],
    amenityNames: [
      'Restaurante',
      'Estacionamiento',
      'Baños',
      'Centro de información',
    ],
  },
  {
    name: 'Reserva Indio Maíz',
    slug: 'reserva-indio-maiz',
    description:
      'La selva tropical más grande de Centroamérica con más de 263,000 hectáreas de bosque lluvioso, biodiversidad extraordinaria y comunidades indígenas rama y kriol.',
    location: {
      lat: 11.0825,
      lng: -84.095,
      address: 'El Castillo, Río San Juan, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.7,
    isFeatured: true,
    categorySlug: 'reservas',
    departmentSlug: 'chontales',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=600&fit=crop',
        altText: 'Selva tropical de la Reserva Indio Maíz',
        isHero: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop',
        altText: 'Río serpentean-do por la selva',
        isHero: false,
      },
    ],
    activities: [
      {
        name: 'Tour de Canoa por el Río',
        description:
          'Navegación en canoa por los ríos de la reserva con guía indígena observando fauna silvestre.',
        price: 35,
        duration: 240,
        difficulty: 'EASY',
        included: ['canoa', 'guía indígena', 'almuerzo'],
        toBring: ['repelente', 'agua', 'traje de baño'],
      },
      {
        name: 'Senderismo en la Selva',
        description:
          'Caminata de 6 horas por senderos ancestrales con observación de monos, aves y reptiles.',
        price: 45,
        duration: 360,
        difficulty: 'MODERATE',
        included: ['guía certificado', 'almuerzo', 'equipo básico'],
        toBring: ['botas impermeables', 'repelente', 'agua'],
      },
      {
        name: 'Avistamiento de Tortugas',
        description:
          'Tour nocturno para observar tortugas marinas anidando en las playas de la costa caribeña.',
        price: 30,
        duration: 180,
        difficulty: 'EASY',
        included: ['guía', 'transporte'],
        toBring: ['linterna roja', 'repelente'],
      },
    ],
    amenityNames: [
      'Guías certificados',
      'Camping',
      'Primeros auxilios',
      'Señalización de senderos',
    ],
  },

  // ==========================================
  // ESTELÍ
  // ==========================================
  {
    name: 'Tisey-Estanzuela',
    slug: 'tisey-estanzuela',
    description:
      'Reserva natural con cascadas, bosques nublados y la cascada más alta de Nicaragua, un paraíso para el senderismo y la observación de aves endémicas.',
    location: {
      lat: 13.0833,
      lng: -86.35,
      address: 'Estelí, Estelí, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.5,
    isFeatured: false,
    categorySlug: 'reservas',
    departmentSlug: 'esteli',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1432405972618-c6b0cfba8b44?w=800&h=600&fit=crop',
        altText: 'Cascada en la reserva Tisey-Estanzuela',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Senderismo a la Cascada',
        description:
          'Caminata de 3 horas hasta la cascada principal con baño en pozas naturales.',
        price: 10,
        duration: 180,
        difficulty: 'MODERATE',
        included: ['guía local'],
        toBring: ['calzado deportivo', 'traje de baño', 'agua'],
      },
      {
        name: 'Avistamiento de Quetzales',
        description:
          'Tour de madrugada para observar el quetzal centroamericano y otras aves endémicas.',
        price: 25,
        duration: 240,
        difficulty: 'MODERATE',
        included: ['guía ornitológico', 'binoculares'],
        toBring: ['ropa de abrigo', 'agua', 'desayuno'],
      },
    ],
    amenityNames: [
      'Guías certificados',
      'Señalización de senderos',
      'Primeros auxilios',
      'Camping',
    ],
  },
  {
    name: 'Miraflor',
    slug: 'miraflor',
    description:
      'Reserva de Bosque Nublado con fincas de café orgánico, miradores sobre el valle de Estelí y una biodiversidad de más de 200 especies de aves.',
    location: {
      lat: 13.1,
      lng: -86.3,
      address: 'Estelí, Estelí, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.6,
    isFeatured: false,
    categorySlug: 'cafe',
    departmentSlug: 'esteli',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=600&fit=crop',
        altText: 'Paisaje montañoso de Miraflor con niebla matutina',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Tour de Café',
        description:
          'Recorrido por finca cafetalera orgánica aprendiendo el proceso del grano taza a taza.',
        price: 20,
        duration: 150,
        difficulty: 'EASY',
        included: ['guía', 'degustación'],
        toBring: ['calzado cerrado', 'agua'],
      },
      {
        name: 'Caminata por el Bosque Nublado',
        description:
          'Senderismo guiado por el bosque nublado con observación de orquídeas y aves.',
        price: 15,
        duration: 180,
        difficulty: 'MODERATE',
        included: ['guía'],
        toBring: ['ropa de abrigo', 'calzado de montaña'],
      },
    ],
    amenityNames: [
      'Guías certificados',
      'Hospedaje',
      'Restaurante',
      'Señalización de senderos',
    ],
  },
  {
    name: 'Reserva Tomabú',
    slug: 'reserva-tomabu',
    description:
      'Área protegida en las montañas de Estelí con bosques de pino-encino, cascadas y una de las mayores diversidades de orquídeas de Nicaragua.',
    location: {
      lat: 13.12,
      lng: -86.38,
      address: 'Estelí, Estelí, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.3,
    isFeatured: false,
    categorySlug: 'reservas',
    departmentSlug: 'esteli',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
        altText: 'Bosque de pino-encino en la Reserva Tomabú',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Senderismo Ecológico',
        description:
          'Caminata por senderos de dificultad media con observación de orquídeas y fauna silvestre.',
        price: 12,
        duration: 150,
        difficulty: 'MODERATE',
        included: ['guía'],
        toBring: ['agua', 'calzado deportivo', 'binoculares'],
      },
      {
        name: 'Avistamiento de Orquídeas',
        description:
          'Tour especializado para observar más de 300 especies de orquídeas nativas.',
        price: 18,
        duration: 120,
        difficulty: 'EASY',
        included: ['guía botánico'],
        toBring: ['cámara macro', 'agua'],
      },
    ],
    amenityNames: [
      'Guías certificados',
      'Señalización de senderos',
      'Camping',
      'Primeros auxilios',
    ],
  },

  // ==========================================
  // GRANADA
  // ==========================================
  {
    name: 'Granada',
    slug: 'granada',
    description:
      'Una de las ciudades coloniales más antiguas de América, con calles de colores vibrantes, iglesias barrocas y la imponente Catedral de Nuestra Señora de la Asunción.',
    location: {
      lat: 11.9344,
      lng: -85.956,
      address: 'Granada, Granada, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.8,
    isFeatured: true,
    categorySlug: 'colonial',
    departmentSlug: 'granada',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1584904558330-f9772a6778c5?w=800&h=600&fit=crop',
        altText: 'Catedral de Granada en la plaza central',
        isHero: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1578906343425-e215e8b0c3ee?w=800&h=600&fit=crop',
        altText: 'Calles coloridas del centro colonial de Granada',
        isHero: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop',
        altText: 'Vista del Parque Central de Granada al atardecer',
        isHero: false,
      },
    ],
    activities: [
      {
        name: 'Tour de la Ciudad Colonial',
        description:
          'Recorrido guiado por las calles históricas de Granada visitando iglesias, museos y plazas coloniales.',
        price: 15,
        duration: 150,
        difficulty: 'EASY',
        included: ['guía', 'entrada a museos'],
        toBring: ['agua', 'cámara', 'protector solar'],
      },
      {
        name: 'Paseo en Carretones',
        description:
          'Recorrido tradicional en carretones tirados por caballos por las principales atracciones de la ciudad.',
        price: 12,
        duration: 60,
        difficulty: 'EASY',
        included: ['carretón', 'guía'],
        toBring: ['cámara'],
      },
      {
        name: 'Subida a la Torre de la Catedral',
        description:
          'Escalada a la torre de la catedral con vista panorámica de 360 grados de la ciudad y el Lago Nicaragua.',
        price: 3,
        duration: 30,
        difficulty: 'EASY',
        included: [],
        toBring: ['cámara'],
      },
    ],
    amenityNames: [
      'Restaurante',
      'Baños',
      'Estacionamiento',
      'Tienda de souvenirs',
      'Hospedaje',
      'WiFi',
      'Centro de información',
    ],
  },
  {
    name: 'Volcán Mombacho',
    slug: 'volcan-mombacho',
    description:
      'Volcán dormant con bosque nublado de cloud forest, tres senderos de dificultad variable y una estación biológica con vistas espectaculares de Granada y Las Isletas.',
    location: {
      lat: 11.8333,
      lng: -85.9667,
      address: 'Granada, Granada, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.6,
    isFeatured: true,
    categorySlug: 'volcanes',
    departmentSlug: 'granada',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        altText: 'Volcán Mombacho cubierto de nubes',
        isHero: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
        altText: 'Sendero del bosque nublado en el Mombacho',
        isHero: false,
      },
    ],
    activities: [
      {
        name: 'Senderismo Crater Trail',
        description:
          'Caminata de 2.5 horas al cráter del volcán con observación de flora y fauna del bosque nublado.',
        price: 10,
        duration: 150,
        difficulty: 'MODERATE',
        included: ['guía', 'entrada'],
        toBring: ['agua', 'calzado de montaña', 'chompa'],
      },
      {
        name: 'Zipline en el Bosque Nublado',
        description:
          'Recorrido de cables tirolesa sobre el dosel del bosque nublado con 5 cables y Tarzan swing.',
        price: 35,
        duration: 90,
        difficulty: 'EASY',
        included: ['equipo', 'guía', 'instrucciones'],
        toBring: ['ropa cómoda', 'zapatos cerrados'],
      },
      {
        name: 'Tour de Café Café Las Flores',
        description:
          'Recorrido por la finca cafetalera en las faldas del volcán aprendiendo el proceso artesanal del café.',
        price: 16,
        duration: 90,
        difficulty: 'EASY',
        included: ['guía', 'degustación'],
        toBring: ['calzado cerrado'],
      },
    ],
    amenityNames: [
      'Restaurante',
      'Estacionamiento',
      'Baños',
      'Guías certificados',
      'Mirador',
      'Señalización de senderos',
    ],
  },
  {
    name: 'Las Isletas de Granada',
    slug: 'las-isletas-de-granada',
    description:
      'Archipiélago de 365 isletas volcánicas en el Lago Nicaragua, formadas por la erupción del Mombacho, con comunidades locales, restaurantes flotantes y avifauna abundante.',
    location: {
      lat: 11.9,
      lng: -85.93,
      address: 'Granada, Granada, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.5,
    isFeatured: true,
    categorySlug: 'lagos',
    departmentSlug: 'granada',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
        altText: 'Las Isletas de Granada con el Volcán Mombacho de fondo',
        isHero: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop',
        altText: 'Paseo en bote por las isletas',
        isHero: false,
      },
    ],
    activities: [
      {
        name: 'Paseo en Bote por las Isletas',
        description:
          'Recorrido de 1.5 horas navegando entre las isletas observando monos aulladores y aves.',
        price: 20,
        duration: 90,
        difficulty: 'EASY',
        included: ['bote', 'guía'],
        toBring: ['protector solar', 'agua', 'cámara'],
      },
      {
        name: 'Visita a Isla de los Monos',
        description:
          'Visita a la isla privada con monos aulladores y tortugas en un santuario natural.',
        price: 15,
        duration: 60,
        difficulty: 'EASY',
        included: ['acceso', 'guía'],
        toBring: ['cámara', 'fruta para los monos'],
      },
      {
        name: 'Kayak en el Lago',
        description:
          'Explora las isletas en kayak con libertad de movimiento y contacto directo con la naturaleza.',
        price: 18,
        duration: 120,
        difficulty: 'EASY',
        included: ['kayak', 'chaleco salvavidas'],
        toBring: ['traje de baño', 'agua'],
      },
    ],
    amenityNames: [
      'Restaurante',
      'Baños',
      'Transporte incluido',
      'Estacionamiento',
      'Pet-friendly',
    ],
  },

  // ==========================================
  // JINOTEGA
  // ==========================================
  {
    name: 'San Rafael del Norte',
    slug: 'san-rafael-del-norte',
    description:
      "Pueblo montañero de clima fresco conocido como 'La Sultana de las Montañas', con templos coloniales y acceso a la reserva de la Montaña de Kilambé.",
    location: {
      lat: 13.2167,
      lng: -86.1,
      address: 'San Rafael del Norte, Jinotega, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.2,
    isFeatured: false,
    categorySlug: 'colonial',
    departmentSlug: 'jinotega',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
        altText: 'Paisaje montañoso alrededor de San Rafael del Norte',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Visita a la Laguna de Jaysapa',
        description:
          'Excursión a la laguna de montaña con senderos interpretativos y observación de aves.',
        price: 15,
        duration: 180,
        difficulty: 'MODERATE',
        included: ['guía', 'transporte'],
        toBring: ['agua', 'calzado deportivo'],
      },
      {
        name: 'Recorrido por el Pueblo',
        description:
          'Caminata histórica por las calles empedradas visitando la iglesia y miradores naturales.',
        price: 5,
        duration: 60,
        difficulty: 'EASY',
        included: ['guía local'],
        toBring: ['cámara'],
      },
    ],
    amenityNames: [
      'Restaurante',
      'Baños',
      'Hospedaje',
      'Centro de información',
    ],
  },
  {
    name: 'Cerro Mogotón',
    slug: 'cerro-mogoton',
    description:
      'El punto más alto de Nicaragua con 2,107 metros sobre el nivel del mar, compartido con Honduras, con bosques nublados y vistas a dos océanos en días despejados.',
    location: {
      lat: 13.7667,
      lng: -86.5167,
      address: 'Jinotega, Jinotega, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.4,
    isFeatured: false,
    categorySlug: 'aventura',
    departmentSlug: 'jinotega',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
        altText: 'Cumbre del Cerro Mogotón cubierta de nubes',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Ascenso al Punto Más Alto',
        description:
          'Ascenso guiado de 6 horas a la cima más alta de Nicaragua con vistas a dos océanos.',
        price: 60,
        duration: 360,
        difficulty: 'HARD',
        included: ['guía certificado', 'almuerzo', 'equipo'],
        toBring: ['ropa de abrigo', 'calzado de montaña', 'agua', 'linterna'],
      },
      {
        name: 'Camping en la Cumbre',
        description:
          'Noche de campamento en la cima con observación de estrellas y amanecer panorámico.',
        price: 85,
        duration: 1440,
        difficulty: 'HARD',
        included: ['guía', 'equipo de camping', 'comidas'],
        toBring: ['ropa de abrigo', 'bolsa de dormir'],
      },
    ],
    amenityNames: [
      'Guías certificados',
      'Camping',
      'Señalización de senderos',
      'Primeros auxilios',
    ],
  },
  {
    name: 'Datanlí-El Diablo',
    slug: 'datanli-el-diablo',
    description:
      'Reserva privada con bosques nublados, plantaciones de café y el mirador más alto de Jinotega con vistas al Valle de los Pinos.',
    location: {
      lat: 13.15,
      lng: -86.15,
      address: 'Jinotega, Jinotega, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.5,
    isFeatured: false,
    categorySlug: 'reservas',
    departmentSlug: 'jinotega',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=600&fit=crop',
        altText: 'Valle de los Pinos visto desde Datanlí-El Diablo',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Recorrido por la Reserva',
        description:
          'Tour guiado por senderos del bosque nublado con observación de quetzales y orquídeas.',
        price: 25,
        duration: 240,
        difficulty: 'MODERATE',
        included: ['guía', 'almuerzo'],
        toBring: ['ropa de abrigo', 'calzado de montaña', 'binoculares'],
      },
      {
        name: 'Tour de Café de Especialidad',
        description:
          'Recorrido por la plantación de café de altitud aprendiendo técnicas de producción sostenible.',
        price: 20,
        duration: 150,
        difficulty: 'EASY',
        included: ['guía', 'degustación'],
        toBring: ['calzado cerrado'],
      },
    ],
    amenityNames: [
      'Guías certificados',
      'Restaurante',
      'Hospedaje',
      'Señalización de senderos',
    ],
  },

  // ==========================================
  // LEÓN
  // ==========================================
  {
    name: 'León',
    slug: 'leon',
    description:
      'La antigua capital de Nicaragua con el centro colonial más grande de Centroamérica, murales revolucionarios y la imponente Catedral de León, Patrimonio de la Humanidad.',
    location: {
      lat: 12.4356,
      lng: -86.8783,
      address: 'León, León, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.7,
    isFeatured: true,
    categorySlug: 'colonial',
    departmentSlug: 'leon',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578906343425-e215e8b0c3ee?w=800&h=600&fit=crop',
        altText: 'Catedral de León con su fachada blanca',
        isHero: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop',
        altText: 'Murales revolucionarios en las calles de León',
        isHero: false,
      },
    ],
    activities: [
      {
        name: 'Tour del Centro Colonial',
        description:
          'Recorrido a pie por el centro histórico visitando 14 iglesias, museos y la Catedral Patrimonio de la Humanidad.',
        price: 10,
        duration: 180,
        difficulty: 'EASY',
        included: ['guía', 'entrada a museos'],
        toBring: ['agua', 'cámara', 'protector solar'],
      },
      {
        name: 'Subida a la Catedral',
        description:
          'Ascenso al techo de la catedral para vistas panorámicas de la ciudad y los volcanes cercanos.',
        price: 3,
        duration: 45,
        difficulty: 'EASY',
        included: [],
        toBring: ['cámara'],
      },
      {
        name: 'Museo de la Revolución',
        description:
          'Visita guiada al museo que narra la historia de la revolución sandinista con testimonios directos.',
        price: 5,
        duration: 90,
        difficulty: 'EASY',
        included: ['guía'],
        toBring: [],
      },
    ],
    amenityNames: [
      'Restaurante',
      'Baños',
      'Estacionamiento',
      'Tienda de souvenirs',
      'WiFi',
      'Centro de información',
    ],
  },
  {
    name: 'Cerro Negro',
    slug: 'cerro-negro',
    description:
      'El volcán más joven de Centroamérica (1850) y el único lugar del mundo donde se puede hacer volcano boarding, deslizándote por sus pendientes de ceniza negra.',
    location: {
      lat: 12.5022,
      lng: -86.7022,
      address: 'León, León, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.8,
    isFeatured: true,
    categorySlug: 'aventura',
    departmentSlug: 'leon',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1580309237429-661ea0e5add3?w=800&h=600&fit=crop',
        altText: 'Cerro Negro con sus pendientes de ceniza negra',
        isHero: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop',
        altText: 'Turistas haciendo volcano boarding en el Cerro Negro',
        isHero: false,
      },
    ],
    activities: [
      {
        name: 'Volcano Boarding',
        description:
          'La experiencia más extrema de Nicaragua: deslízate a 50 km/h por las pendientes de ceniza del volcán más joven de Centroamérica.',
        price: 35,
        duration: 180,
        difficulty: 'MODERATE',
        included: [
          'equipo de protección',
          'tabla',
          'guía',
          'transporte',
          'almuerzo',
        ],
        toBring: ['agua', 'protector solar', 'ropa que se pueda ensuciar'],
      },
      {
        name: 'Ascenso al Cráter',
        description:
          'Caminata de 45 minutos hasta el cráter activo con vistas de 360 grados del paisaje volcánico.',
        price: 5,
        duration: 60,
        difficulty: 'MODERATE',
        included: ['entrada'],
        toBring: ['agua', 'calzado cerrado'],
      },
      {
        name: 'Cerro Negro + Las Peñitas',
        description:
          'Combinación de volcanoboarding en la mañana y relax en la playa de Las Peñitas en la tarde.',
        price: 55,
        duration: 480,
        difficulty: 'MODERATE',
        included: ['equipo', 'guía', 'transporte', 'comidas'],
        toBring: ['traje de baño', 'crema solar', 'agua'],
      },
    ],
    amenityNames: [
      'Guías certificados',
      'Transporte incluido',
      'Baños',
      'Primeros auxilios',
    ],
  },
  {
    name: 'Las Peñitas',
    slug: 'las-penitas',
    description:
      'Playa de arena oscura volcánica a 20 minutos de León, con olas perfectas para surf, manglares y una vibe relajada de pueblo pesquero.',
    location: {
      lat: 12.35,
      lng: -87.03,
      address: 'León, León, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.3,
    isFeatured: false,
    categorySlug: 'playas',
    departmentSlug: 'leon',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        altText: 'Atardecer en la playa de Las Peñitas',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Clases de Surf',
        description:
          'Aprende a surfear en las olas consistentes de Las Peñitas con instructor local.',
        price: 30,
        duration: 120,
        difficulty: 'EASY',
        included: ['tabla', 'instructor', 'transporte'],
        toBring: ['traje de baño', 'crema solar'],
      },
      {
        name: 'Paseo en Kayak por los Manglares',
        description:
          'Navegación en kayak por los manglares del estuario observando aves y crustáceos.',
        price: 15,
        duration: 90,
        difficulty: 'EASY',
        included: ['kayak', 'guía'],
        toBring: ['agua', 'repelente'],
      },
    ],
    amenityNames: ['Restaurante', 'Baños', 'Hospedaje', 'Surf', 'Pet-friendly'],
  },
  {
    name: 'Momotombo',
    slug: 'momotombo',
    description:
      'Volcán active con una simetría perfecta que se eleva 1,610 metros sobre el Lago de Managua, ofreciendo uno de los ascensos más desafiantes de Nicaragua.',
    location: {
      lat: 12.4231,
      lng: -86.5389,
      address: 'León, León, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.5,
    isFeatured: false,
    categorySlug: 'volcanes',
    departmentSlug: 'leon',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
        altText: 'Volcán Momotombo con su cono perfecto sobre el lago',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Ascenso al Volcán',
        description:
          'Ascenso de 6 horas al cráter activo con vistas espectaculares al Lago de Managua y las isletas.',
        price: 50,
        duration: 360,
        difficulty: 'HARD',
        included: ['guía certificado', 'almuerzo', 'equipo'],
        toBring: ['calzado de montaña', 'agua', 'ropa de abrigo', 'linterna'],
      },
      {
        name: 'Amanecer en el Momotombo',
        description:
          'Ascenso nocturno para presenciar el amanecer desde la cima con vista al volcán Cerro Negro.',
        price: 65,
        duration: 420,
        difficulty: 'HARD',
        included: ['guía', 'desayuno', 'equipo'],
        toBring: ['ropa de abrigo', 'linterna', 'agua', 'calzado de montaña'],
      },
    ],
    amenityNames: [
      'Guías certificados',
      'Transporte incluido',
      'Primeros auxilios',
    ],
  },

  // ==========================================
  // MADRIZ
  // ==========================================
  {
    name: 'Somoto',
    slug: 'somoto',
    description:
      'Capital de Madriz en la frontera con Honduras, puerta de entrada al Cañón de Somoto y centro de la tradición artesanal de hamacas y sombreros de palma.',
    location: {
      lat: 13.4833,
      lng: -86.5833,
      address: 'Somoto, Madriz, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.1,
    isFeatured: false,
    categorySlug: 'colonial',
    departmentSlug: 'madriz',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
        altText: 'Paisaje montañoso alrededor de Somoto',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Visita a Artesanos Locales',
        description:
          'Recorrido por talleres de hamacas tejidas a mano y sombreros de palma tradicionales.',
        price: 5,
        duration: 60,
        difficulty: 'EASY',
        included: ['guía local'],
        toBring: ['efectivo para compras'],
      },
      {
        name: 'Tour Gastronómico',
        description:
          'Degustación de platillos típicos de Madriz incluyendo nacatamales y pinol.',
        price: 12,
        duration: 120,
        difficulty: 'EASY',
        included: ['guía', 'degustaciones'],
        toBring: ['apetito'],
      },
    ],
    amenityNames: [
      'Restaurante',
      'Tienda de souvenirs',
      'Baños',
      'Centro de información',
    ],
  },
  {
    name: 'Cañón de Somoto',
    slug: 'canon-de-somoto',
    description:
      'Monumento Nacional y Geopark de la UNESCO, un cañón de 12 kilómetros formado por el Río Coco con paredes rocosas de hasta 150 metros y aguas cristalinas.',
    location: {
      lat: 13.55,
      lng: -86.63,
      address: 'Somoto, Madriz, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.7,
    isFeatured: true,
    categorySlug: 'aventura',
    departmentSlug: 'madriz',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop',
        altText: 'Cañón de Somoto con aguas cristalinas',
        isHero: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1432405972618-c6b0cfba8b44?w=800&h=600&fit=crop',
        altText: 'Salto de rocas en el Cañón de Somoto',
        isHero: false,
      },
    ],
    activities: [
      {
        name: 'Canyoneering Completo',
        description:
          'Aventura de 5 horas por el cañón incluyendo natación, saltos de roca de hasta 12 metros y exploración de cuevas.',
        price: 35,
        duration: 300,
        difficulty: 'MODERATE',
        included: ['guía', 'equipo', 'almuerzo', 'bote'],
        toBring: ['traje de baño', 'calzado acuático', 'agua'],
      },
      {
        name: 'Senderismo al Mirador',
        description:
          'Caminata de 4 horas hasta los miradores del cañón con vistas panorámicas de la formación rocosa.',
        price: 25,
        duration: 240,
        difficulty: 'MODERATE',
        included: ['guía', 'almuerzo'],
        toBring: ['agua', 'calzado deportivo', 'protector solar'],
      },
      {
        name: 'Camping en el Cañón',
        description:
          'Noche de campamento junto al río con fogata y observación de estrellas en el cañón.',
        price: 80,
        duration: 1440,
        difficulty: 'MODERATE',
        included: ['guía', 'equipo de camping', 'comidas'],
        toBring: ['ropa de abrigo', 'linterna'],
      },
    ],
    amenityNames: [
      'Guías certificados',
      'Camping',
      'Baños',
      'Primeros auxilios',
      'Señalización de senderos',
    ],
  },

  // ==========================================
  // MANAGUA
  // ==========================================
  {
    name: 'Puerto Salvador Allende',
    slug: 'puerto-salvador-allende',
    description:
      'Complejo turístico en el Lago de Managua con malecón, restaurantes, vida nocturna y espectaculares atardeceres sobre el agua.',
    location: {
      lat: 12.1667,
      lng: -86.2833,
      address: 'Managua, Managua, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.3,
    isFeatured: true,
    categorySlug: 'colonial',
    departmentSlug: 'managua',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        altText: 'Atardecer en Puerto Salvador Allende',
        isHero: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
        altText: 'Paseo en bote en el Lago de Managua',
        isHero: false,
      },
    ],
    activities: [
      {
        name: 'Paseo en Bote al Atardecer',
        description:
          'Navegación romántica por el Lago de Managua disfrutando del atardecer y la brisa lacustre.',
        price: 15,
        duration: 60,
        difficulty: 'EASY',
        included: ['bote', 'refresco'],
        toBring: ['cámara', 'chompa ligera'],
      },
      {
        name: 'Recorrido Gastronómico',
        description:
          'Tour por los restaurantes del puerto probando mariscos frescos y cocina nicaragüense.',
        price: 25,
        duration: 120,
        difficulty: 'EASY',
        included: ['guía', 'degustaciones'],
        toBring: ['efectivo', 'apetito'],
      },
    ],
    amenityNames: [
      'Restaurante',
      'Estacionamiento',
      'Baños',
      'WiFi',
      'Hospedaje',
      'Seguridad',
    ],
  },
  {
    name: 'Huellas de Acahualinca',
    slug: 'huellas-de-acahualinca',
    description:
      'Yacimiento arqueológico con huellas humanas fossilizadas de más de 3,000 años de antigüedad, evidencia del primer asentamiento humano en Nicaragua.',
    location: {
      lat: 12.1333,
      lng: -86.2333,
      address: 'Managua, Managua, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.2,
    isFeatured: false,
    categorySlug: 'arqueologia',
    departmentSlug: 'managua',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1461360370896-922624d12571?w=800&h=600&fit=crop',
        altText: 'Huellas fosilizadas en el yacimiento de Acahualinca',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Tour Arqueológico',
        description:
          'Visita guiada al museo y el yacimiento aprendiendo sobre los primeros pobladores de Nicaragua.',
        price: 3,
        duration: 60,
        difficulty: 'EASY',
        included: ['guía', 'entrada'],
        toBring: ['cámara'],
      },
      {
        name: 'Taller de Arqueología',
        description:
          'Experiencia educativa para niños y adultos sobre técnicas de excavación y conservación.',
        price: 8,
        duration: 90,
        difficulty: 'EASY',
        included: ['materiales', 'guía'],
        toBring: [],
      },
    ],
    amenityNames: [
      'Museo',
      'Baños',
      'Estacionamiento',
      'Tienda de souvenirs',
      'Accesibilidad',
    ],
  },

  // ==========================================
  // MASAYA
  // ==========================================
  {
    name: 'Volcán Masaya',
    slug: 'volcan-masaya',
    description:
      'Parque Nacional con uno de los pocos lagos de lava activos del mundo, donde se puede observar el cráter Santiago humeante a solo metros de distancia.',
    location: {
      lat: 11.9763,
      lng: -86.1572,
      address: 'Masaya, Masaya, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.8,
    isFeatured: true,
    categorySlug: 'volcanes',
    departmentSlug: 'masaya',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1580309237429-661ea0e5add3?w=800&h=600&fit=crop',
        altText: 'Cráter Santiago del Volcán Masaya con humo',
        isHero: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        altText: 'Vista aérea del Parque Nacional Volcán Masaya',
        isHero: false,
      },
    ],
    activities: [
      {
        name: 'Visita Diurna al Cráter',
        description:
          'Recorrido guiado por el Parque Nacional observando el cráter Santiago y los campos de lava.',
        price: 5,
        duration: 120,
        difficulty: 'EASY',
        included: ['guía', 'transporte dentro del parque'],
        toBring: ['agua', 'mascarilla para gases'],
      },
      {
        name: 'Noche en el Volcán',
        description:
          'Experiencia nocturna para observar el resplandor del lava en el cráter Santiago bajo las estrellas.',
        price: 10,
        duration: 150,
        difficulty: 'EASY',
        included: ['guía', 'transporte'],
        toBring: ['chaqueta', 'mascarilla'],
      },
      {
        name: 'Exploración de Tuberías de Lava',
        description:
          'Descenso guiado al sistema de tubos de lava Tzinaconostoc con linterna y equipo especial.',
        price: 20,
        duration: 120,
        difficulty: 'MODERATE',
        included: ['guía', 'equipo', 'linterna'],
        toBring: ['calzado cerrado', 'ropa que se pueda ensuciar'],
      },
    ],
    amenityNames: [
      'Guías certificados',
      'Estacionamiento',
      'Baños',
      'Restaurante',
      'Museo',
      'Centro de información',
    ],
  },
  {
    name: 'Mercado de Artesanías de Masaya',
    slug: 'mercado-de-artesanias-masaya',
    description:
      'El mercado de artesanías más grande de Centroamérica, con cientos de puestos vendiendo hamacas, cerámica, joyería y productos típicos de todo Nicaragua.',
    location: {
      lat: 11.9841,
      lng: -86.0951,
      address: 'Masaya, Masaya, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.4,
    isFeatured: false,
    categorySlug: 'cultura',
    departmentSlug: 'masaya',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
        altText: 'Hilanderas de hamacas en el Mercado de Masaya',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Recorrido por el Mercado',
        description:
          'Tour guiado por los diferentes sectores del mercado aprendiendo sobre artesanías de cada región.',
        price: 8,
        duration: 90,
        difficulty: 'EASY',
        included: ['guía'],
        toBring: ['efectivo', 'bolsa para compras'],
      },
      {
        name: 'Taller de Tejido',
        description:
          'Aprende a tejer una hamaca artesanal con artesanas locales del mercado.',
        price: 15,
        duration: 120,
        difficulty: 'EASY',
        included: ['materiales', 'guía'],
        toBring: ['paciencia'],
      },
    ],
    amenityNames: [
      'Tienda de souvenirs',
      'Restaurante',
      'Baños',
      'Estacionamiento',
    ],
  },

  // ==========================================
  // MATAGALPA
  // ==========================================
  {
    name: 'Selva Negra',
    slug: 'selva-negra',
    description:
      'Ecolodge histórico de café orgánico fundado por inmigrantes alemanes en 1891, con 12 millas de senderos en bosque nublado y producción de café carbon-negativo.',
    location: {
      lat: 13.05,
      lng: -86.25,
      address: 'Matagalpa, Matagalpa, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.7,
    isFeatured: true,
    categorySlug: 'cafe',
    departmentSlug: 'matagalpa',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=600&fit=crop',
        altText: 'Bosque nublado de Selva Negra con niebla matutina',
        isHero: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
        altText: 'Sendero por el bosque nublado de Selva Negra',
        isHero: false,
      },
    ],
    activities: [
      {
        name: 'Tour de Café Orgánico',
        description:
          'Recorrido por la finca cafetalera de 50 años aprendiendo el proceso completo del café orgánico carbon-negativo.',
        price: 20,
        duration: 150,
        difficulty: 'EASY',
        included: ['guía', 'degustación de café'],
        toBring: ['calzado cerrado', 'chaqueta ligera'],
      },
      {
        name: 'Senderismo en Bosque Nublado',
        description:
          'Caminata por 12 millas de senderos observando quetzales, orquídeas, monos aulladores y pumas.',
        price: 15,
        duration: 180,
        difficulty: 'MODERATE',
        included: ['guía'],
        toBring: ['calzado de montaña', 'binoculares', 'agua'],
      },
      {
        name: 'Avistamiento de Aves al Amanecer',
        description:
          'Tour de madrugada con guía ornitológico para observar más de 250 especies de aves del bosque nublado.',
        price: 25,
        duration: 180,
        difficulty: 'EASY',
        included: ['guía', 'desayuno'],
        toBring: ['ropa de abrigo', 'binoculares'],
      },
    ],
    amenityNames: [
      'Hospedaje',
      'Restaurante',
      'Guías certificados',
      'Señalización de senderos',
      'Camping',
      'WiFi',
      'Estacionamiento',
    ],
  },
  {
    name: 'Matagalpa',
    slug: 'matagalpa',
    description:
      "Capital de la región montañosa de Nicaragua, conocida como 'La Perla del Norte', con café de altitud, clima fresco y arquitectura colonial en valles verdes.",
    location: {
      lat: 12.925,
      lng: -85.958,
      address: 'Matagalpa, Matagalpa, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.3,
    isFeatured: false,
    categorySlug: 'colonial',
    departmentSlug: 'matagalpa',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
        altText: 'Valles verdes alrededor de Matagalpa',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Tour del Café en la Ciudad',
        description:
          'Recorrido por cafeterías artesanales y el mercado municipal probando café de altitud.',
        price: 10,
        duration: 120,
        difficulty: 'EASY',
        included: ['guía', 'degustaciones'],
        toBring: ['apetito por café'],
      },
      {
        name: 'Visita a la Cascada El Chocoyero',
        description:
          'Excursión a la cascada más alta de la región con baño en pozas naturales.',
        price: 15,
        duration: 180,
        difficulty: 'MODERATE',
        included: ['guía', 'transporte'],
        toBring: ['traje de baño', 'calzado deportivo', 'agua'],
      },
    ],
    amenityNames: [
      'Restaurante',
      'Baños',
      'Estacionamiento',
      'Centro de información',
      'WiFi',
    ],
  },

  // ==========================================
  // NUEVA SEGOVIA
  // ==========================================
  {
    name: 'Ocotal',
    slug: 'ocotal',
    description:
      'Capital de Nueva Segovia en la frontera norte, ciudad histórica de la resistencia con templos coloniales y acceso asenderismo en las montañas del norte.',
    location: {
      lat: 13.6333,
      lng: -86.4833,
      address: 'Ocotal, Nueva Segovia, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.1,
    isFeatured: false,
    categorySlug: 'colonial',
    departmentSlug: 'nueva-segovia',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
        altText: 'Paisaje montañoso alrededor de Ocotal',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Senderismo en la Frontera',
        description:
          'Caminata por senderos con vistas a Honduras y paisajes montañosos del norte de Nicaragua.',
        price: 10,
        duration: 180,
        difficulty: 'MODERATE',
        included: ['guía local'],
        toBring: ['agua', 'calzado deportivo', 'pasaporte'],
      },
      {
        name: 'Recorrido Histórico',
        description:
          'Tour por la ciudad visitando sitios de la historia de la resistencia y templos coloniales.',
        price: 5,
        duration: 90,
        difficulty: 'EASY',
        included: ['guía'],
        toBring: ['cámara'],
      },
    ],
    amenityNames: [
      'Restaurante',
      'Baños',
      'Estacionamiento',
      'Centro de información',
    ],
  },

  // ==========================================
  // RÍO SAN JUAN
  // ==========================================
  {
    name: 'El Castillo',
    slug: 'el-castillo',
    description:
      'Pueblo fortificado en la ribera del Río San Juan, con el Fuerte de la Inmaculada Concepción del siglo XVII y acceso a la Reserva Indio Maíz.',
    location: {
      lat: 11.0167,
      lng: -84.4,
      address: 'El Castillo, Río San Juan, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.4,
    isFeatured: false,
    categorySlug: 'colonial',
    departmentSlug: 'rio-san-juan',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578906343425-e215e8b0c3ee?w=800&h=600&fit=crop',
        altText: 'Fuerte colonial de El Castillo en el Río San Juan',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Visita al Fuerte Colonial',
        description:
          'Recorrido por la fortaleza del siglo XVII con vistas al Río San Juan y la selva.',
        price: 3,
        duration: 60,
        difficulty: 'EASY',
        included: ['guía', 'entrada'],
        toBring: ['cámara'],
      },
      {
        name: 'Paseo en Canoa',
        description:
          'Navegación en canoa por el Río San Juan observando cocodrilos, monos y aves.',
        price: 20,
        duration: 180,
        difficulty: 'EASY',
        included: ['canoa', 'guía'],
        toBring: ['repelente', 'agua', 'traje de baño'],
      },
    ],
    amenityNames: ['Restaurante', 'Hospedaje', 'Baños', 'Transporte incluido'],
  },
  {
    name: 'Solentiname',
    slug: 'solentiname',
    description:
      'Archipiélago de 36 islas en el Lago de Nicaragua, refugio de artesanías en cerámica y pintura, y lugar de la marty de Ernesto Cardenal.',
    location: {
      lat: 11.1333,
      lng: -84.7167,
      address: 'San Carlos, Río San Juan, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.3,
    isFeatured: false,
    categorySlug: 'lagos',
    departmentSlug: 'rio-san-juan',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
        altText: 'Islas del archipiélago de Solentiname',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Paseo en Bote por las Islas',
        description:
          'Navegación por el archipiélago visitando comunidades de artesanos ceramistas.',
        price: 25,
        duration: 180,
        difficulty: 'EASY',
        included: ['bote', 'guía'],
        toBring: ['agua', 'protector solar', 'cámara'],
      },
      {
        name: 'Taller de Cerámica',
        description:
          'Aprende las técnicas ancestrales de cerámica con los artesanos de Solentiname.',
        price: 15,
        duration: 120,
        difficulty: 'EASY',
        included: ['materiales', 'guía'],
        toBring: [],
      },
    ],
    amenityNames: [
      'Tienda de souvenirs',
      'Restaurante',
      'Transporte incluido',
      'Baños',
    ],
  },
  {
    name: 'San Carlos',
    slug: 'san-carlos',
    description:
      'Capital del Río San Juan en la orilla del Lago de Nicaragua, puerta de entrada a la Reserva Indio Maíz y punto de conexión con Costa Rica por vía fluvial.',
    location: {
      lat: 11.1269,
      lng: -84.7781,
      address: 'San Carlos, Río San Juan, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.2,
    isFeatured: false,
    categorySlug: 'colonial',
    departmentSlug: 'rio-san-juan',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop',
        altText: 'Puerto de San Carlos en el Lago de Nicaragua',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Paseo en Lancha por el Lago',
        description:
          'Navegación por el Lago de Nicaragua observando la isla de Ometepe y el volcán Concepción.',
        price: 20,
        duration: 120,
        difficulty: 'EASY',
        included: ['lancha', 'guía'],
        toBring: ['agua', 'cámara', 'protector solar'],
      },
      {
        name: 'Visita al Mirador',
        description:
          'Subida al mirador natural con vista panorámica del lago, la ciudad y los volcanes.',
        price: 3,
        duration: 45,
        difficulty: 'EASY',
        included: [],
        toBring: ['cámara'],
      },
    ],
    amenityNames: [
      'Restaurante',
      'Baños',
      'Estacionamiento',
      'Centro de información',
      'Transporte incluido',
    ],
  },

  // ==========================================
  // RIVAS
  // ==========================================
  {
    name: 'San Juan del Sur',
    slug: 'san-juan-del-sur',
    description:
      'Pueblo costero con la playa más popular de surf de Nicaragua, bahía protegida, estatua del Cristo y vida nocturna vibrante en el Pacífico sur.',
    location: {
      lat: 11.2517,
      lng: -85.8681,
      address: 'San Juan del Sur, Rivas, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.6,
    isFeatured: true,
    categorySlug: 'playas',
    departmentSlug: 'rivas',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        altText: 'Bahía de San Juan del Sur al atardecer',
        isHero: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
        altText: 'Playa Maderas con olas de surf',
        isHero: false,
      },
    ],
    activities: [
      {
        name: 'Clases de Surf en Playa Maderas',
        description:
          'Aprende a surfear en la playa más famosa de surf de Nicaragua con instructor certificado.',
        price: 35,
        duration: 120,
        difficulty: 'EASY',
        included: ['tabla', 'instructor', 'transporte'],
        toBring: ['traje de baño', 'crema solar'],
      },
      {
        name: 'Paseo en Catamarán al Atardecer',
        description:
          'Navegación en catamarán por la costa disfrutando de refrescos y la puesta de sol.',
        price: 45,
        duration: 180,
        difficulty: 'EASY',
        included: ['catamarán', 'refrescos', 'guía'],
        toBring: ['chompa ligera', 'cámara'],
      },
      {
        name: 'Visita al Cristo de Misericordia',
        description:
          'Caminata hasta la estatua del Cristo con la vista más panorámica de la bahía.',
        price: 3,
        duration: 60,
        difficulty: 'MODERATE',
        included: [],
        toBring: ['agua', 'calzado deportivo'],
      },
    ],
    amenityNames: [
      'Restaurante',
      'Baños',
      'Hospedaje',
      'WiFi',
      'Surf',
      'Vestidores',
      'Guardarropa',
      'Centro de información',
    ],
  },
  {
    name: 'Isla de Ometepe',
    slug: 'isla-de-ometepe',
    description:
      'La isla más grande del Lago de Nicaragua formada por dos volcanes: el activo Concepción y el extinto Maderas, un oasis de paz con playas negras y bosques tropicales.',
    location: {
      lat: 11.5,
      lng: -85.58,
      address: 'Ometepe, Rivas, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.8,
    isFeatured: true,
    categorySlug: 'islas',
    departmentSlug: 'rivas',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1580309237429-661ea0e5add3?w=800&h=600&fit=crop',
        altText: 'Volcán Concepción visto desde la playa en Ometepe',
        isHero: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1770924712622-111a5a2eaaa4?w=800&h=600&fit=crop',
        altText: 'Campo de cultivo con el Volcán Concepción de fondo',
        isHero: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        altText: 'Atardecer en Playa Santo Domingo, Ometepe',
        isHero: false,
      },
    ],
    activities: [
      {
        name: 'Ascenso al Volcán Concepción',
        description:
          'Ascenso de 5 horas al volcán activo de 1,610 metros con vistas espectaculares del lago.',
        price: 13,
        duration: 300,
        difficulty: 'HARD',
        included: ['guía', 'entrada'],
        toBring: ['calzado de montaña', 'agua', 'chompa', 'protector solar'],
      },
      {
        name: 'Hike al Volcán Maderas',
        description:
          'Caminata de 6 horas al volcán extinto con cráter de laguna interior y bosque nublado.',
        price: 15,
        duration: 360,
        difficulty: 'MODERATE',
        included: ['guía', 'entrada'],
        toBring: ['calzado de montaña', 'agua', ' impermeable'],
      },
      {
        name: 'Tour de la Isla',
        description:
          'Recorrido en transporte por los puntos principales de la isla: playas, miradores y fincas.',
        price: 30,
        duration: 360,
        difficulty: 'EASY',
        included: ['transporte', 'guía', 'almuerzo'],
        toBring: ['cámara', 'agua', 'protector solar'],
      },
      {
        name: 'Nado en Ojo de Agua',
        description:
          'Visita a la poza de agua natural de origen volcánico con temperatura perfecta todo el año.',
        price: 3,
        duration: 90,
        difficulty: 'EASY',
        included: ['entrada'],
        toBring: ['traje de baño', 'toalla'],
      },
    ],
    amenityNames: [
      'Restaurante',
      'Hospedaje',
      'Baños',
      'Estacionamiento',
      'Guías certificados',
      'Transporte incluido',
      'Señalización de senderos',
      'Pet-friendly',
    ],
  },
  {
    name: 'Popoyo',
    slug: 'popoyo',
    description:
      'Pueblo de surf legendario con una de las mejores rompientes de tubo del mundo, atrayendo a surfistas profesionales de toda Centroamérica.',
    location: {
      lat: 11.4833,
      lng: -85.9667,
      address: 'Popoyo, Rivas, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.5,
    isFeatured: true,
    categorySlug: 'playas',
    departmentSlug: 'rivas',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        altText: 'Ola de tubo en Popoyo',
        isHero: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1502680390548-bdbac40a9b21?w=800&h=600&fit=crop',
        altText: 'Atardecer dorado en la playa de Popoyo',
        isHero: false,
      },
    ],
    activities: [
      {
        name: 'Clases de Surf para Intermedios',
        description:
          'Aprende a surfear en las olas consistentes de Popoyo con instructor experimentado.',
        price: 40,
        duration: 120,
        difficulty: 'MODERATE',
        included: ['tabla', 'instructor', 'transporte'],
        toBring: ['traje de baño', 'crema solar'],
      },
      {
        name: 'Paseo en Quad por la Costa',
        description:
          'Recorrido en ATV por la costa Pacífica visitando playas vírgenes y miradores.',
        price: 45,
        duration: 180,
        difficulty: 'EASY',
        included: ['ATV', 'guía', 'cascos'],
        toBring: ['crema solar', 'lentes de sol'],
      },
    ],
    amenityNames: ['Restaurante', 'Hospedaje', 'Baños', 'Surf', 'Pet-friendly'],
  },
  {
    name: 'Playa Madera',
    slug: 'playa-madera',
    description:
      'Playa virgen de arena dorada entre acantilados, accesible solo por sendero o bote, con olas perfectas para principiantes y snorkel en arrecifes.',
    location: {
      lat: 11.45,
      lng: -85.9,
      address: 'Rivas, Rivas, Nicaragua',
    },
    priceLevel: 'LOW' as const,
    rating: 4.4,
    isFeatured: false,
    categorySlug: 'playas',
    departmentSlug: 'rivas',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        altText: 'Playa Madera con arena dorada y acantilados',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Snorkel en la Playa',
        description:
          'Exploración de los arrecifes de coral con snorkel observando peces tropicales y tortugas.',
        price: 15,
        duration: 120,
        difficulty: 'EASY',
        included: ['equipo de snorkel', 'guía'],
        toBring: ['traje de baño', 'crema solar'],
      },
      {
        name: 'Senderismo Costero',
        description:
          'Caminata por el sendero de la playa con vistas a los acantilados y playas cercanas.',
        price: 5,
        duration: 90,
        difficulty: 'EASY',
        included: [],
        toBring: ['agua', 'calzado deportivo'],
      },
    ],
    amenityNames: [
      'Baños',
      'Restaurante',
      'Señalización de senderos',
      'Primeros auxilios',
    ],
  },

  // ==========================================
  // RACCN - Región Autónoma del Atlántico Norte
  // ==========================================
  {
    name: 'Bilwi (Puerto Cabezas)',
    slug: 'bilwi-puerto-cabezas',
    description:
      'Capital de la RACCN en la costa caribeña, centro de la cultura Miskito con playas de arena coralina, palmeras y la festival aldeano de Palo de Mayo.',
    location: {
      lat: 14.0333,
      lng: -83.3833,
      address: 'Bilwi, RACCN, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.2,
    isFeatured: false,
    categorySlug: 'playas',
    departmentSlug: 'racCN',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        altText: 'Playa de arena coralina en Bilwi',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Tour de la Costa Caribeña',
        description:
          'Recorrido por las comunidades costeras miskitas conociendo su cultura y tradiciones.',
        price: 35,
        duration: 360,
        difficulty: 'EASY',
        included: ['guía', 'transporte', 'almuerzo'],
        toBring: ['repelente', 'agua', 'cámara'],
      },
      {
        name: 'Pesca con Comunidades Locales',
        description:
          'Experiencia de pesca tradicional con pescadores miskitos en la costa caribeña.',
        price: 30,
        duration: 240,
        difficulty: 'EASY',
        included: ['equipo', 'guía', 'almuerzo'],
        toBring: ['protector solar', 'agua'],
      },
    ],
    amenityNames: [
      'Restaurante',
      'Hospedaje',
      'Baños',
      'Centro de información',
      'Transporte incluido',
    ],
  },
  {
    name: 'Cabo Gracias a Dios',
    slug: 'cabo-gracias-a-dios',
    description:
      'Punta donde el Río Coco desemboca en el Caribe, frontera natural entre Nicaragua y Honduras, con playas vírgenes y comunidades miskitas y mayangnas.',
    location: {
      lat: 14.9833,
      lng: -83.6333,
      address: 'RACCN, Nicaragua',
    },
    priceLevel: 'HIGH' as const,
    rating: 4.5,
    isFeatured: false,
    categorySlug: 'aventura',
    departmentSlug: 'racCN',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        altText: 'Desembocadura del Río Coco en el Caribe',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Expedición Fluvial al Cabo',
        description:
          'Navegación en lancha por el Río Coco hasta la desembocadura en el Caribe.',
        price: 120,
        duration: 480,
        difficulty: 'MODERATE',
        included: ['lancha', 'guía', 'comidas', 'equipo'],
        toBring: ['repelente', 'agua', 'ropa para la lluvia'],
      },
      {
        name: 'Visita a Comunidades Indígenas',
        description:
          'Encuentro cultural con comunidades Miskitas y Mayangnas en la costa caribeña.',
        price: 80,
        duration: 360,
        difficulty: 'EASY',
        included: ['guía', 'transporte', 'almuerzo'],
        toBring: ['respeto cultural', 'regalos simbólicos'],
      },
    ],
    amenityNames: [
      'Guías certificados',
      'Transporte incluido',
      'Camping',
      'Primeros auxilios',
    ],
  },

  // ==========================================
  // RACCS - Región Autónoma del Atlántico Sur
  // ==========================================
  {
    name: 'Corn Island',
    slug: 'corn-island',
    description:
      'Isla caribeña de 10 km con playas de arena blanca, arrecifes de coral y la mejor experiencia de snorkel y buceo de Nicaragua en aguas turquesas del Caribe.',
    location: {
      lat: 12.1667,
      lng: -83.05,
      address: 'Corn Island, RACCS, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.7,
    isFeatured: true,
    categorySlug: 'islas',
    departmentSlug: 'racCS',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        altText: 'Playa de Corn Island con palmeras y arena blanca',
        isHero: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
        altText: 'Snorkel en los arrecifes de Corn Island',
        isHero: false,
      },
    ],
    activities: [
      {
        name: 'Snorkel en el Arrecife',
        description:
          'Excursión de snorkel en los arrecifes de coral observando peces tropicales, tortugas y mantas.',
        price: 25,
        duration: 120,
        difficulty: 'EASY',
        included: ['equipo de snorkel', 'guía', 'bote'],
        toBring: ['traje de baño', 'crema solar'],
      },
      {
        name: 'Circunnavegación en Bote',
        description:
          'Recorrido en bote alrededor de la isla con paradas en playas vírgenes y puntos de buceo.',
        price: 35,
        duration: 180,
        difficulty: 'EASY',
        included: ['bote', 'guía', 'snack'],
        toBring: ['agua', 'cámara', 'traje de baño'],
      },
      {
        name: 'Buceo Certificado',
        description:
          'Buceo en los arrecifes profundos de Corn Island con掩码 de bugui certificado.',
        price: 60,
        duration: 180,
        difficulty: 'MODERATE',
        included: ['equipo', 'instructor', 'bote'],
        toBring: ['certificado de buceo', 'toalla'],
      },
    ],
    amenityNames: [
      'Restaurante',
      'Hospedaje',
      'Baños',
      'Vestidores',
      'Guardarropa',
      'Centro de información',
      'Pet-friendly',
    ],
  },
  {
    name: 'Little Corn Island',
    slug: 'little-corn-island',
    description:
      'Isla gemela sin vehículos motorizados, un paraíso tranquilo con playas vírgenes, snorkel excepcional y restaurantes de mariscos frescos frente al mar.',
    location: {
      lat: 12.3,
      lng: -83.0667,
      address: 'Little Corn Island, RACCS, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.8,
    isFeatured: true,
    categorySlug: 'islas',
    departmentSlug: 'racCS',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        altText: 'Playa virgen de Little Corn Island',
        isHero: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
        altText: 'Sendero por la selva de Little Corn',
        isHero: false,
      },
    ],
    activities: [
      {
        name: 'Snorkel en el Blue Hole',
        description:
          'Buceo en el Blue Hole, un pozo submarino de 30 metros con tunellos y vida marina abundante.',
        price: 30,
        duration: 120,
        difficulty: 'EASY',
        included: ['equipo', 'guía', 'bote'],
        toBring: ['traje de baño', 'cámara acuática'],
      },
      {
        name: 'Caminata a Punta Sur',
        description:
          'Senderismo hasta el punto más al sur de la isla con vistas al Caribe profundo.',
        price: 5,
        duration: 60,
        difficulty: 'EASY',
        included: [],
        toBring: ['agua', 'calzado deportivo'],
      },
    ],
    amenityNames: [
      'Restaurante',
      'Hospedaje',
      'Baños',
      'Snorkel',
      'Vestidores',
    ],
  },
  {
    name: 'Laguna de Perlas',
    slug: 'laguna-de-perlas',
    description:
      'Laguna costera en la RACCS con manglares extensos, pesca artesanal y comunidades garífunas que mantienen vivas sus tradiciones africanas.',
    location: {
      lat: 12.5667,
      lng: -83.6833,
      address: 'Laguna de Perlas, RACCS, Nicaragua',
    },
    priceLevel: 'MEDIUM' as const,
    rating: 4.2,
    isFeatured: false,
    categorySlug: 'playas',
    departmentSlug: 'racCS',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        altText: 'Laguna de Perlas con manglares',
        isHero: true,
      },
    ],
    activities: [
      {
        name: 'Tour por los Manglares',
        description:
          'Navegación en canoa por los canales de manglar observando aves y crustáceos.',
        price: 25,
        duration: 180,
        difficulty: 'EASY',
        included: ['canoa', 'guía'],
        toBring: ['repelente', 'agua', 'cámara'],
      },
      {
        name: 'Pesca Artesanal',
        description:
          'Experiencia de pesca tradicional con pescadores locales en la laguna.',
        price: 20,
        duration: 180,
        difficulty: 'EASY',
        included: ['equipo', 'guía'],
        toBring: ['protector solar', 'sombrero'],
      },
    ],
    amenityNames: [
      'Restaurante',
      'Hospedaje',
      'Transporte incluido',
      'Guías certificados',
    ],
  },
];
