"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { List, X, User, SignOut, CaretDown, Sparkle } from "@phosphor-icons/react";
import { useAuth } from "@/hooks/useAuth";
import { useScrollPosition, useOnClickOutside } from "@/hooks";
import { Avatar, Badge, Button, type ButtonVariant, type ButtonSize } from "@/components/ui";
import { LanguageSwitcher } from "@/components/providers/LanguageSwitcher";
import { cn } from "@/lib/cn";

interface NavLink {
  key: "destinations" | "itineraries" | "blog" | "aiGuide";
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { key: "destinations", href: "/explorar" },
  { key: "itineraries", href: "/itinerarios" },
  { key: "blog", href: "/blog" },
  { key: "aiGuide", href: "/planificar" },
];

const authButtonStyles: { variant: ButtonVariant; size: ButtonSize; className?: string } = {
  variant: "primary",
  size: "sm",
  className: "shadow-xs",
};

export function Navbar() {
  const { t } = useTranslation("nav");
  const { t: tCommon } = useTranslation("common");
  const { user, gamification, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { isScrolled } = useScrollPosition(50);

  useOnClickOutside(userMenuRef, () => setIsUserMenuOpen(false), isUserMenuOpen);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMobileMenuOpen]);

  if (pathname?.startsWith("/auth")) return null;

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  return (
    <nav
      id="main-navbar"
      aria-label={tCommon("appName")}
      className={cn(
        "fixed top-0 left-0 w-full z-1100 transition-all duration-300 ease-out-expo",
        isScrolled
          ? "bg-surface/90 dark:bg-volcano-black/90 backdrop-blur-md py-3 border-b border-outline-variant/30 shadow-sm"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center gap-4">
        <Link
          href="/"
          id="nav-logo"
          className="flex items-center gap-2.5 group transition-opacity hover:opacity-95"
        >
          {/* Volcán Momotombo Isotype */}
          <div className="w-9 h-9 rounded-xl bg-surface-container-high/80 dark:bg-volcano-black border border-outline-variant/40 flex items-center justify-center p-1.5 shadow-xs group-hover:border-primary/50 transition-colors">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
              aria-hidden="true"
            >
              <path
                d="M16 5L26 23H6L16 5Z"
                className="fill-primary dark:fill-primary-container"
              />
              <circle cx="16" cy="7.5" r="2" fill="#ff4500" />
              <path
                d="M14 11L16 6L18 11"
                stroke="#ff7849"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M4 26C7 25 10 27 16 26C22 25 25 27 28 26"
                stroke="#004f96"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M7 29C10 28.5 13 29.5 16 29C19 28.5 22 29.5 25 29"
                stroke="#4ba3c7"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeOpacity="0.7"
              />
            </svg>
          </div>
          <span className="font-serif text-2xl md:text-3xl font-bold tracking-tighter text-on-background">
            Momotombo <span className="font-light italic text-primary">Travels</span>
          </span>
        </Link>


        <div className="hidden md:flex gap-8 font-sans font-medium text-xs tracking-wider uppercase items-center">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.key}
                href={link.href}
                id={`nav-link-${link.key}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "transition-colors duration-200 relative group py-2",
                  isActive ? "text-primary font-semibold" : "text-on-surface-variant hover:text-primary"
                )}
              >
                {t(link.key)}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-0.5 bg-primary transition-[width] duration-300 ease-out-expo group-hover:w-full",
                    isActive ? "w-full" : "w-0"
                  )}
                />
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex gap-3 items-center">
          <LanguageSwitcher />
          {user ? (
            <div className="flex items-center gap-3">
              {gamification && (
                <Badge variant="secondary" size="sm" id="nav-xp-badge" iconLeft={<Sparkle size={12} weight="fill" className="animate-pulse" />}>
                  XP: {gamification.points.toLocaleString()}
                </Badge>
              )}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  id="nav-user-menu-button"
                  aria-haspopup="menu"
                  aria-expanded={isUserMenuOpen}
                  aria-label={t("userMenu")}
                  className="flex items-center gap-2 bg-surface-container/60 hover:bg-surface-container border border-outline-variant/30 px-2 py-1.5 rounded-full transition-transform duration-150 active:scale-[0.97] text-on-surface"
                >
                  <Avatar name={user.name} size="xs" className="w-6 h-6 text-[10px]" />
                  <span className="text-xs font-semibold max-w-[90px] truncate">{user.name.split(" ")[0]}</span>
                  <CaretDown size={12} className={cn("transition-transform duration-200", isUserMenuOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                      style={{ transformOrigin: "top right" }}
                      role="menu"
                      className="absolute right-0 top-full mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 overflow-hidden text-on-surface"
                    >
                      <div className="px-4 py-3 border-b border-outline-variant/20 bg-surface-container-low">
                        <p className="font-bold text-xs truncate">{user.name}</p>
                        <p className="text-[10px] text-on-surface-variant opacity-80 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/perfil"
                        id="nav-menu-profile-link"
                        role="menuitem"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-surface-container transition-colors duration-150"
                      >
                        <User size={14} className="text-primary" />
                        {t("myProfile")}
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        id="nav-menu-logout-button"
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-danger hover:bg-danger-container/40 transition-colors duration-150 text-left"
                      >
                        <SignOut size={14} />
                        {t("signOut")}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/auth/registro"
                id="nav-register-link"
                className="text-on-surface-variant hover:text-primary font-medium transition-colors text-xs uppercase tracking-wider"
              >
                {t("signUp")}
              </Link>
              <Button
                {...authButtonStyles}
                onClick={() => router.push("/auth/login")}
                iconLeft={<User size={13} />}
                id="nav-login-button"
                className="text-xs"
              >
                {t("signIn")}
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          id="mobile-menu-toggle"
          aria-label={isMobileMenuOpen ? t("closeMenu") : t("openMenu")}
          aria-expanded={isMobileMenuOpen}
          className="md:hidden text-on-background hover:text-primary transition-colors p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <List size={24} aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="md:hidden bg-surface-container-lowest dark:bg-volcano-black border-t border-outline-variant/30 overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  id={`nav-link-${link.key}-mobile`}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={cn(
                    "text-on-surface text-base font-medium hover:text-primary transition-colors py-1",
                    pathname === link.href && "text-primary font-bold"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t(link.key)}
                </Link>
              ))}
              <div className="h-px bg-outline-variant/30" />
              <div className="flex justify-start">
                <LanguageSwitcher />
              </div>
              {user ? (
                <div className="flex flex-col gap-4">
                  {gamification && (
                    <div className="flex items-center gap-1.5 text-secondary font-semibold text-sm">
                      <Sparkle size={14} weight="fill" />
                      <span>XP: {gamification.points.toLocaleString()}</span>
                    </div>
                  )}
                  <Link
                    href="/perfil"
                    id="nav-profile-link-mobile"
                    className="text-on-surface text-base font-medium hover:text-primary transition-colors flex items-center gap-2 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={16} aria-hidden="true" /> {t("myProfile")}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    id="nav-logout-button-mobile"
                    className="text-danger text-base font-medium text-left flex items-center gap-2 py-1"
                  >
                    <SignOut size={16} aria-hidden="true" /> {t("signOut")}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link
                    href="/auth/registro"
                    id="nav-register-link-mobile"
                    className="text-on-surface text-center py-3 rounded-full border border-outline-variant font-bold text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("signUp")}
                  </Link>
                  <Link
                    href="/auth/login"
                    id="nav-login-button-mobile"
                    className="bg-primary text-on-primary py-3 rounded-full text-center font-bold text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("signIn")}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
