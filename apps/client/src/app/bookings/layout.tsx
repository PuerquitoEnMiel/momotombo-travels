import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tus Reservas",
  description:
    "Consulta y gestiona tus reservas de tours, actividades y experiencias en Nicaragua.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
