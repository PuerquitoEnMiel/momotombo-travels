import Image from 'next/image';

interface TravelCardProps {
    name: string;
    description: string;
    priceLevel: string;
    imageUrl?: string;
}

export function TravelCard({ name, description, priceLevel, imageUrl }: TravelCardProps) {
    return (
        <div className="bg-white/80 dark:bg-black/60 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-[box-shadow,transform] duration-250 ease-out active:scale-[0.97] group">
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={imageUrl || "https://placehold.co/600x400/006d77/ffffff?text=Nicaragua"}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    {priceLevel}
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-xl font-serif font-bold text-volcano-black dark:text-white mb-1">{name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{description}</p>
                <button className="mt-4 w-full bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container font-medium py-2 px-4 rounded-lg transition-[background-color,color] duration-150 ease-out active:scale-[0.97] cursor-pointer">
                    Ver Detalles
                </button>
            </div>
        </div>
    );
}
