"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import { FacebookLogo, InstagramLogo, TwitterLogo, MapPin, Envelope, Phone, Heart } from "@phosphor-icons/react";
import { Container } from "@/components/ui";

export function Footer() {
  const { t } = useTranslation("common");
  const { t: tNav } = useTranslation("nav");
  const pathname = usePathname();

  if (pathname?.startsWith("/auth")) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-volcano-black text-nica-white pt-16 pb-8 border-t border-white/5">
      <Container size="lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <Link href="/" id="footer-logo-link" className="font-serif text-2xl font-bold tracking-tighter mb-6 block hover:opacity-90 transition-opacity">
              Momotombo <span className="font-light italic text-primary">Travels</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 text-pretty">
              {t("appTagline")}. Descubre Nicaragua con la ayuda de nuestra inteligencia artificial experta.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" id="footer-social-fb" aria-label="Facebook" className="text-gray-400 hover:text-volcan-magma transition-colors duration-200">
                <FacebookLogo size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" id="footer-social-ig" aria-label="Instagram" className="text-gray-400 hover:text-volcan-magma transition-colors duration-200">
                <InstagramLogo size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" id="footer-social-tw" aria-label="Twitter" className="text-gray-400 hover:text-volcan-magma transition-colors duration-200">
                <TwitterLogo size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold mb-6 text-oro-indigena">{tNav("destinations")}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/explorar" id="footer-link-destinations" className="hover:text-nica-white transition-colors duration-200">{tNav("destinations")}</Link></li>
              <li><Link href="/explorar?cat=playas" id="footer-link-beaches" className="hover:text-nica-white transition-colors duration-200">Playas</Link></li>
              <li><Link href="/explorar?cat=volcanes" id="footer-link-volcanoes" className="hover:text-nica-white transition-colors duration-200">Volcanes</Link></li>
              <li><Link href="/explorar?cat=colonial" id="footer-link-colonial" className="hover:text-nica-white transition-colors duration-200">Ciudades Coloniales</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold mb-6 text-oro-indigena">Institucional</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/institucional/quienes-somos" id="footer-link-about" className="hover:text-nica-white transition-colors duration-200">Quiénes Somos</Link></li>
              <li><Link href="/institucional/contacto" id="footer-link-contact" className="hover:text-nica-white transition-colors duration-200">Contacto</Link></li>
              <li><Link href="/terminos" id="footer-link-terms" className="hover:text-nica-white transition-colors duration-200">Términos y Condiciones</Link></li>
              <li><Link href="/privacidad" id="footer-link-privacy" className="hover:text-nica-white transition-colors duration-200">Política de Privacidad</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold mb-6 text-oro-indigena">Contacto</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-volcan-magma mt-0.5 shrink-0" aria-hidden="true" />
                <span>Managua, Nicaragua</span>
              </li>
              <li className="flex items-center gap-3">
                <Envelope size={18} className="text-volcan-magma shrink-0" aria-hidden="true" />
                <a href="mailto:hola@momotombo.travel" id="footer-email-link" className="hover:text-nica-white transition-colors duration-200">hola@momotombo.travel</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-volcan-magma shrink-0" aria-hidden="true" />
                <a href="tel:+50588888888" id="footer-phone-link" className="hover:text-nica-white transition-colors duration-200">+505 8888 8888</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; {currentYear} {t("appName")}. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1.5">
            <span>Hecho con</span>
            <Heart size={13} weight="fill" className="text-volcan-magma animate-pulse" aria-hidden="true" />
            <span>en Nicaragua</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
