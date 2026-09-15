"use client";

import Link from "next/link";
import { Compass, House, MagnifyingGlass } from "@phosphor-icons/react";
import { Button, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container size="md" className="py-24">
      <div className="text-center">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Compass size={40} weight="duotone" />
        </div>
        <p className="text-sm font-bold uppercase tracking-widest text-oro-indigena mb-3">
          Error 404
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-on-surface mb-4 text-balance">
          Página no encontrada
        </h1>
        <p className="text-on-surface-variant mb-10 max-w-md mx-auto text-pretty">
          La ruta que buscas no existe o fue movida. Pero hay mucho por descubrir en Nicaragua.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => (window.location.href = "/")}
            iconLeft={<House size={16} />}
          >
            Ir al inicio
          </Button>
          <Link href="/explorar">
            <Button variant="outline" iconLeft={<MagnifyingGlass size={16} />}>
              Explorar Nicaragua
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
