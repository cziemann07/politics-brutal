"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Sun,
  Moon,
  User,
  Heart,
  Settings,
  Bell,
  Crown,
  ChevronRight,
  LogIn,
  LogOut,
  Shield,
  Search,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

const editorials = [
  { href: "/fiscalize", label: "fiscalize", color: "radar-secondary" },
  { href: "/noticias", label: "radarnews", color: "radar-accent" },
  { href: "/litera", label: "litera", color: "radar-primary" },
  { href: "/contato", label: "contato", color: "radar-muted" },
];

const mobileNavItems = [
  { href: "/noticias", label: "Notícias" },
  { href: "/fiscalize", label: "Fiscalize" },
  { href: "/fiscalize/deputados", label: "Deputados" },
  { href: "/fiscalize/votacoes", label: "Votações" },
  { href: "/litera", label: "Litera" },
  { href: "/planos", label: "Planos" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  const isLoggedIn = !!user;

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setIsProfileOpen(false);
      window.location.href = "/noticias";
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isEditorialActive = (href: string) => {
    if (href === "/noticias") return pathname === "/" || pathname?.startsWith("/noticias");
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Top Bar - Editorias */}
      <div className="bg-radar-primary dark:bg-radar-dark-surface border-b border-radar-border dark:border-radar-dark-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-8">
            <nav className="flex items-center gap-1">
              {editorials.map((item, index) => (
                <span key={item.href} className="flex items-center">
                  <Link
                    href={item.href}
                    className={`text-xs font-medium tracking-wide transition-colors px-2 py-1 ${
                      isEditorialActive(item.href)
                        ? "text-white bg-radar-accent"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {index < editorials.length - 1 && (
                    <span className="text-white/30 text-xs mx-1">|</span>
                  )}
                </span>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="text-white/70 hover:text-white transition-colors p-1"
                aria-label={isDark ? "Modo claro" : "Modo escuro"}
              >
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 bg-radar-surface dark:bg-radar-dark-bg transition-shadow duration-200 ${
          isScrolled ? "shadow-medium" : "shadow-soft"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-radar-text dark:text-radar-dark-text hover:bg-radar-bg dark:hover:bg-radar-dark-surface rounded-md transition-colors"
              aria-label="Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/noticias" className="flex items-center gap-2">
              <span className="text-headline-sm md:text-headline-md text-radar-primary dark:text-radar-dark-text font-bold tracking-tight">
                radar <span className="text-radar-accent">sem filtro</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                href="/noticias"
                className={`text-body-sm font-medium transition-colors ${
                  isEditorialActive("/noticias")
                    ? "text-radar-accent"
                    : "text-radar-text dark:text-radar-dark-text hover:text-radar-accent"
                }`}
              >
                Notícias
              </Link>
              <Link
                href="/fiscalize"
                className={`text-body-sm font-medium transition-colors ${
                  isEditorialActive("/fiscalize")
                    ? "text-radar-accent"
                    : "text-radar-text dark:text-radar-dark-text hover:text-radar-accent"
                }`}
              >
                Fiscalize
              </Link>
              <Link
                href="/fiscalize/deputados"
                className={`text-body-sm font-medium transition-colors ${
                  pathname === "/fiscalize/deputados"
                    ? "text-radar-accent"
                    : "text-radar-text dark:text-radar-dark-text hover:text-radar-accent"
                }`}
              >
                Deputados
              </Link>
              <Link
                href="/planos"
                className={`text-body-sm font-medium transition-colors ${
                  pathname === "/planos"
                    ? "text-radar-accent"
                    : "text-radar-text dark:text-radar-dark-text hover:text-radar-accent"
                }`}
              >
                Planos
              </Link>
            </nav>

            {/* Right Side - Profile */}
            <div className="flex items-center gap-2">
              {/* Profile Button */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-radar-text dark:text-radar-dark-text hover:bg-radar-bg dark:hover:bg-radar-dark-surface rounded-lg transition-colors"
                >
                  <User size={20} />
                  <span className="hidden md:inline text-body-sm font-medium">
                    {isLoggedIn ? (user.displayName || "Perfil") : "Entrar"}
                  </span>
                </button>

                {/* Profile Popup */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-radar-surface dark:bg-radar-dark-surface border border-radar-border dark:border-radar-dark-border rounded-lg shadow-large z-50">
                    {!isLoggedIn ? (
                      <div className="p-4">
                        <div className="text-center mb-4">
                          <div className="w-14 h-14 bg-radar-bg dark:bg-radar-dark-bg border border-radar-border dark:border-radar-dark-border rounded-full mx-auto flex items-center justify-center mb-3">
                            <User size={28} className="text-radar-muted dark:text-radar-dark-muted" />
                          </div>
                          <p className="font-semibold text-radar-text dark:text-radar-dark-text">Visitante</p>
                          <p className="text-caption text-radar-muted dark:text-radar-dark-muted">
                            Faça login para acompanhar deputados
                          </p>
                        </div>
                        <Link
                          href="/auth"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-radar-accent text-white font-medium rounded-lg hover:bg-radar-accent/90 transition-colors"
                        >
                          <LogIn size={18} />
                          Entrar ou Cadastrar
                        </Link>
                      </div>
                    ) : (
                      <>
                        {/* Header */}
                        <div className="p-4 border-b border-radar-border dark:border-radar-dark-border">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-radar-bg dark:bg-radar-dark-bg border border-radar-border dark:border-radar-dark-border rounded-full flex items-center justify-center overflow-hidden">
                              {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.displayName || ""} className="w-full h-full object-cover" />
                              ) : (
                                <User size={24} className="text-radar-muted" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-radar-text dark:text-radar-dark-text">
                                {user.displayName || "Cidadão"}
                              </p>
                              <p className="text-caption text-radar-muted dark:text-radar-dark-muted">
                                {user.isPremium ? "Plano Pro" : "Plano Gratuito"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <Link
                            href="/perfil"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center justify-between p-3 hover:bg-radar-bg dark:hover:bg-radar-dark-bg rounded-md transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Heart size={18} className="text-radar-muted" />
                              <span className="text-body-sm font-medium text-radar-text dark:text-radar-dark-text">
                                Meus Deputados
                              </span>
                            </div>
                            <ChevronRight size={16} className="text-radar-muted" />
                          </Link>

                          <Link
                            href="/perfil#notificacoes"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center justify-between p-3 hover:bg-radar-bg dark:hover:bg-radar-dark-bg rounded-md transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Bell size={18} className="text-radar-muted" />
                              <span className="text-body-sm font-medium text-radar-text dark:text-radar-dark-text">
                                Notificações
                              </span>
                            </div>
                            <ChevronRight size={16} className="text-radar-muted" />
                          </Link>

                          <Link
                            href="/perfil#configuracoes"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center justify-between p-3 hover:bg-radar-bg dark:hover:bg-radar-dark-bg rounded-md transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Settings size={18} className="text-radar-muted" />
                              <span className="text-body-sm font-medium text-radar-text dark:text-radar-dark-text">
                                Configurações
                              </span>
                            </div>
                            <ChevronRight size={16} className="text-radar-muted" />
                          </Link>

                          {user.isAdmin && (
                            <Link
                              href="/admin"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center justify-between p-3 bg-radar-accent/10 hover:bg-radar-accent/20 rounded-md transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Shield size={18} className="text-radar-accent" />
                                <span className="text-body-sm font-medium text-radar-accent">
                                  Painel Admin
                                </span>
                              </div>
                              <ChevronRight size={16} className="text-radar-accent" />
                            </Link>
                          )}
                        </div>

                        {/* Upgrade */}
                        {!user.isPremium && (
                          <div className="p-2 border-t border-radar-border dark:border-radar-dark-border">
                            <Link
                              href="/planos"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center justify-between p-3 border border-radar-accent rounded-md hover:bg-radar-accent/10 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Crown size={18} className="text-radar-accent" />
                                <span className="text-body-sm font-medium text-radar-text dark:text-radar-dark-text">
                                  Fazer Upgrade
                                </span>
                              </div>
                              <span className="text-caption font-semibold text-radar-success">
                                a partir de R$0,99
                              </span>
                            </Link>
                          </div>
                        )}

                        {/* Logout */}
                        <div className="p-2 border-t border-radar-border dark:border-radar-dark-border">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 p-3 text-radar-muted hover:bg-radar-bg dark:hover:bg-radar-dark-bg rounded-md transition-colors"
                          >
                            <LogOut size={18} />
                            <span className="text-body-sm font-medium">Sair</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-radar-border dark:border-radar-dark-border bg-radar-surface dark:bg-radar-dark-surface">
            <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {mobileNavItems.map((item) => {
                const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-md font-medium transition-colors ${
                      active
                        ? "bg-radar-accent text-white"
                        : "text-radar-text dark:text-radar-dark-text hover:bg-radar-bg dark:hover:bg-radar-dark-bg"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
