import Image from "next/image";

export function WishlistCTA() {
    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-7xl mx-auto relative h-[600px] rounded-3xl overflow-hidden flex items-center justify-center text-center">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop"
                        alt="Lista de deseos"
                        fill
                        sizes="(max-w-1200px) 100vw, 1200px"
                        className="object-cover"
                        priority={false}
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* Content */}
                <div className="relative z-10 text-white max-w-3xl px-4">
                    <span className="block text-sm font-bold tracking-[0.2em] uppercase mb-4 opacity-90">
                        Un mundo por ver
                    </span>
                    <h2 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Tu lista de deseos está <br /> hecha para ser tachada.
                    </h2>
                </div>
            </div>
        </section>
    );
}
