import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pago Seguro de tu Reserva",
  description:
    "Completa el pago de tu reserva de forma segura y recibe la confirmación de tu viaje a Nicaragua al instante.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
