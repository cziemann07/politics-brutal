"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Users,
  FileText,
  TrendingUp,
  Newspaper,
  BarChart3,
  AlertCircle,
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
  Brain,
  Shield,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/", label: "Início", icon: Home },
  { href: "/quiz", label: "Quiz", icon: Brain },
  { href: "/bancada", label: "Bancada", icon: Users },
  { href: "/votacoes", label: "Votações", icon: FileText },
  { href: "/noticias", label: "Notícias", icon: Newspaper },
  { href: "/investigacoes", label: "Investigações", icon: AlertCircle },
  { href: "/eleicoes-2026", label: "Eleições 2026", icon: TrendingUp },
  { href: "/metodologia", label: "Metodologia", icon: BarChart3 },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, signOut, isLoading: authLoading } = useAuth();

  const isLoggedIn = !!user;

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setIsProfileOpen(false);
      // Força reload da página para limpar estado
      window.location.href = "/";
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fechar popup ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Header Sticky */}
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          isScrolled
            ? "bg-brutal-bg dark:bg-brutal-dark-bg border-b-3 border-black dark:border-brutal-dark-border shadow-hard dark:shadow-none"
            : "bg-brutal-bg dark:bg-brutal-dark-bg border-b-3 border-black dark:border-brutal-dark-border"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-black text-white border-2 border-black px-3 py-1 font-black text-xl transform group-hover:scale-105 transition-transform">
                PSF
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 font-bold text-sm uppercase transition-all ${
                      active
                        ? "bg-black text-white border-2 border-black dark:bg-brutal-dark-accent dark:border-brutal-dark-accent"
                        : "hover:bg-black hover:text-white border-2 border-transparent hover:border-black dark:hover:bg-brutal-dark-accent dark:hover:border-brutal-dark-accent"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Theme Toggle, Profile & Mobile Menu */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 border-2 border-black dark:border-brutal-dark-border bg-white dark:bg-brutal-dark-surface font-bold transition-all hover:bg-black hover:text-white dark:hover:bg-brutal-dark-accent"
                aria-label={isDark ? "Ativar modo claro" : "Ativar modo noturno"}
                title={isDark ? "Modo claro" : "Modo noturno"}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Profile Button with Popup */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-2 border-2 border-black dark:border-brutal-dark-border bg-white dark:bg-brutal-dark-surface font-bold transition-all hover:bg-black hover:text-white dark:hover:bg-brutal-dark-accent"
                  aria-label="Meu perfil"
                  title="Meu perfil"
                >
                  <User size={20} />
                </button>

                {/* Profile Popup */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-brutal-dark-surface border-3 border-black dark:border-brutal-dark-border shadow-hard dark:shadow-none z-50">
                    {!isLoggedIn ? (
                      /* Estado Deslogado */
                      <div className="p-4">
                        <div className="text-center mb-4">
                          <div className="w-14 h-14 bg-gray-100 dark:bg-brutal-dark-bg border-2 border-black dark:border-brutal-dark-border mx-auto flex items-center justify-center mb-3">
                            <User size={28} className="text-gray-400 dark:text-brutal-dark-muted" />
                          </div>
                          <p className="font-black text-sm uppercase dark:text-brutal-dark-text">Visitante</p>
                          <p className="text-xs text-gray-500 dark:text-brutal-dark-muted">Faça login para salvar favoritos</p>
                        </div>
                        <Link
                          href="/auth"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full flex items-center justify-center gap-2 p-3 bg-black text-white font-bold text-sm uppercase hover:bg-gray-800 transition-colors"
                        >
                          <LogIn size={16} />
                          Entrar
                        </Link>
                      </div>
                    ) : (
                      /* Estado Logado */
                      <>
                        {/* Header */}
                        <div className="p-4 border-b-2 border-black dark:border-brutal-dark-border">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-brutal-dark-bg border-2 border-black dark:border-brutal-dark-border flex items-center justify-center overflow-hidden">
                              {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.displayName || ""} className="w-full h-full object-cover" />
                              ) : (
                                <User size={20} className="text-gray-600 dark:text-brutal-dark-muted" />
                              )}
                            </div>
                            <div>
                              <p className="font-black text-sm dark:text-brutal-dark-text">{user.displayName || "Cidadão"}</p>
                              <p className="text-xs text-gray-500 dark:text-brutal-dark-muted">
                                {user.isPremium ? "Vigilante PRO" : "Plano Gratuito"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <Link
                            href="/perfil"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-brutal-dark-bg transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Heart size={16} className="text-gray-600 dark:text-brutal-dark-muted" />
                              <span className="font-bold text-sm dark:text-brutal-dark-text">Meus Deputados</span>
                            </div>
                            <ChevronRight size={14} className="text-gray-400" />
                          </Link>

                          <Link
                            href="/perfil#notificacoes"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-brutal-dark-bg transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Bell size={16} className="text-gray-600 dark:text-brutal-dark-muted" />
                              <span className="font-bold text-sm dark:text-brutal-dark-text">Notificações</span>
                            </div>
                            <ChevronRight size={14} className="text-gray-400" />
                          </Link>

                          <Link
                            href="/perfil#configuracoes"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-brutal-dark-bg transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Settings size={16} className="text-gray-600 dark:text-brutal-dark-muted" />
                              <span className="font-bold text-sm dark:text-brutal-dark-text">Configurações</span>
                            </div>
                            <ChevronRight size={14} className="text-gray-400" />
                          </Link>

                          {/* Admin Panel - só mostra se for admin */}
                          {user.isAdmin && (
                            <Link
                              href="/admin"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center justify-between p-3 bg-brutal-red/10 hover:bg-brutal-red/20 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Shield size={16} className="text-brutal-red" />
                                <span className="font-bold text-sm text-brutal-red">Painel Admin</span>
                              </div>
                              <ChevronRight size={14} className="text-brutal-red" />
                            </Link>
                          )}
                        </div>

                        {/* PRO Upgrade - só mostra se não for premium */}
                        {!user.isPremium && (
                          <div className="p-2 border-t border-gray-200 dark:border-brutal-dark-border">
                            <Link
                              href="/perfil#premium"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center justify-between p-3 border-2 border-black dark:border-brutal-dark-border hover:bg-gray-50 dark:hover:bg-brutal-dark-bg transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Crown size={16} className="text-gray-600 dark:text-brutal-dark-muted" />
                                <span className="font-bold text-sm dark:text-brutal-dark-text">Assinar PRO</span>
                              </div>
                              <span className="font-bold text-xs text-green-600 dark:text-green-400">a partir de R$0,99</span>
                            </Link>
                          </div>
                        )}

                        {/* Logout */}
                        <div className="p-2 border-t border-gray-200 dark:border-brutal-dark-border">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 p-3 text-gray-600 dark:text-brutal-dark-muted hover:bg-gray-100 dark:hover:bg-brutal-dark-bg transition-colors"
                          >
                            <LogOut size={16} />
                            <span className="font-bold text-sm">Sair</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden btn-brutal p-2"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t-3 border-black dark:border-brutal-dark-border bg-white dark:bg-brutal-dark-surface">
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 font-bold uppercase border-2 border-black dark:border-brutal-dark-border transition-all ${
                      active
                        ? "bg-black text-white dark:bg-brutal-dark-accent dark:border-brutal-dark-accent"
                        : "bg-white dark:bg-brutal-dark-bg hover:bg-black hover:text-white dark:hover:bg-brutal-dark-accent dark:hover:border-brutal-dark-accent"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
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
