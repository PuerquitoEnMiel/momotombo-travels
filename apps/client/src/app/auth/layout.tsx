import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceso y Registro de Usuarios",
  description:
    "Inicia sesión o crea tu cuenta en Momotombo Travels para guardar itinerarios, gestionar reservas y planificar viajes a Nicaragua.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
