import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal de Guías y Proveedores",
  description:
    "Panel para guías locales y proveedores de experiencias: gestiona actividades, disponibilidad y reservas en Momotombo Travels.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProveedoresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
