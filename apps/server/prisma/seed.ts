import { PrismaClient, UserRole, PriceLevel } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seeding...');

    // 1. Clean Database
    await prisma.favorite.deleteMany();
    await prisma.review.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.itineraryItem.deleteMany();
    await prisma.itineraryDay.deleteMany();
    await prisma.itinerary.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.destinationImage.deleteMany();
    await prisma.destination.deleteMany();
    await prisma.category.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    // 2. Create Admin User
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
    console.log(`👤 Created Admin: ${admin.email}`);

    // 3. Create Categories
    const catVolcano = await prisma.category.create({
        data: { name: 'Volcanes', slug: 'volcanes', description: 'Tierra de fuego y lava.' },
    });
    const catColonial = await prisma.category.create({
        data: { name: 'Ciudades Coloniales', slug: 'colonial', description: 'Historia y arquitectura.' },
    });
    const catBeach = await prisma.category.create({
        data: { name: 'Playas', slug: 'playas', description: 'Sol, arena y surf.' },
    });
    const catIsland = await prisma.category.create({
        data: { name: 'Islas', slug: 'islas', description: 'Paraísos tropicales.' },
    });

    // 4. Create Destinations

    // Granada
    const granada = await prisma.destination.create({
        data: {
            name: 'Granada',
            slug: 'granada',
            description: 'La Gran Sultana, una joya colonial a orillas del Lago Cocibolca. Famosa por su arquitectura, las Isletas y el Volcán Mombacho.',
            location: { lat: 11.9299, lng: -85.9560, address: 'Granada, Nicaragua' },
            priceLevel: PriceLevel.MEDIUM,
            rating: 4.8,
            categoryId: catColonial.id,
            images: {
                create: [
                    { url: 'https://placehold.co/800x600/e29578/ffffff?text=Catedral+de+Granada', isHero: true },
                    { url: 'https://placehold.co/800x600/006d77/ffffff?text=Isletas', isHero: false },
                ],
            },
            activities: {
                create: [
                    { name: 'Tour de Isletas', description: 'Paseo en bote por las 365 isletas.', price: 25, duration: 120 },
                    { name: 'Caminata Mombacho', description: 'Senderismo en el bosque nuboso.', price: 40, duration: 240 },
                ],
            },
        },
    });

    // León
    const leon = await prisma.destination.create({
        data: {
            name: 'León',
            slug: 'leon',
            description: 'Ciudad universitaria y revolucionaria. Hogar de la Catedral más grande de Centroamérica y cerca del Cerro Negro.',
            location: { lat: 12.4379, lng: -86.8780, address: 'León, Nicaragua' },
            priceLevel: PriceLevel.LOW,
            rating: 4.7,
            categoryId: catColonial.id,
            images: {
                create: [
                    { url: 'https://placehold.co/800x600/fdfcdc/1a1a1a?text=Catedral+de+Leon', isHero: true },
                ],
            },
            activities: {
                create: [
                    { name: 'Sandboarding Cerro Negro', description: 'Deslízate sobre ceniza volcánica.', price: 35, duration: 300 },
                    { name: 'Tour de la Revolución', description: 'Historia política de la ciudad.', price: 15, duration: 90 },
                ],
            },
        },
    });

    // Ometepe
    const ometepe = await prisma.destination.create({
        data: {
            name: 'Isla de Ometepe',
            slug: 'ometepe',
            description: 'Un oasis de paz formado por dos volcanes en medio del lago. Naturaleza virgen, petroglifos y el Ojo de Agua.',
            location: { lat: 11.5000, lng: -85.5833, address: 'Rivas, Nicaragua' },
            priceLevel: PriceLevel.LOW,
            rating: 4.9,
            categoryId: catIsland.id,
            images: {
                create: [
                    { url: 'https://placehold.co/800x600/83c5be/1a1a1a?text=Volcan+Concepcion', isHero: true },
                ],
            },
            activities: {
                create: [
                    { name: 'Ojo de Agua', description: 'Relájate en aguas cristalinas.', price: 10, duration: 180 },
                    { name: 'Escalar Volcán Maderas', description: 'Reto físico hasta la laguna del cráter.', price: 30, duration: 480 },
                ],
            },
        },
    });

    // San Juan del Sur
    const sjs = await prisma.destination.create({
        data: {
            name: 'San Juan del Sur',
            slug: 'san-juan-del-sur',
            description: 'La capital del surf y la fiesta. Playas hermosas, atardeceres increíbles y vida nocturna vibrante.',
            location: { lat: 11.2529, lng: -85.8705, address: 'Rivas, Nicaragua' },
            priceLevel: PriceLevel.HIGH,
            rating: 4.5,
            categoryId: catBeach.id,
            images: {
                create: [
                    { url: 'https://placehold.co/800x600/e29578/ffffff?text=Bahia+San+Juan', isHero: true },
                ],
            },
            activities: {
                create: [
                    { name: 'Clases de Surf', description: 'Aprende a domar las olas.', price: 45, duration: 120 },
                    { name: 'Catamarán al Atardecer', description: 'Barra libre y vistas espectaculares.', price: 80, duration: 240 },
                ],
            },
        },
    });

    // Corn Island
    const cornIsland = await prisma.destination.create({
        data: {
            name: 'Corn Island',
            slug: 'corn-island',
            description: 'El Caribe nicaragüense en su máxima expresión. Aguas turquesas, cultura afrocaribeña y el mejor pan de coco.',
            location: { lat: 12.1694, lng: -83.0418, address: 'RAAS, Nicaragua' },
            priceLevel: PriceLevel.LUXURY,
            rating: 5.0,
            categoryId: catIsland.id,
            images: {
                create: [
                    { url: 'https://placehold.co/800x600/006d77/ffffff?text=Little+Corn', isHero: true },
                ],
            },
            activities: {
                create: [
                    { name: 'Snorkeling', description: 'Explora los arrecifes de coral.', price: 30, duration: 120 },
                    { name: 'Vuelta a la Isla', description: 'Recorre la isla en carrito de golf.', price: 50, duration: 180 },
                ],
            },
        },
    });

    console.log('✅ Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
