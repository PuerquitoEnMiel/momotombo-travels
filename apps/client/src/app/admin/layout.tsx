import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administración de Momotombo Travels",
  description:
    "Panel interno de administración de Momotombo Travels: destinos, usuarios, reservas y contenido del blog.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
