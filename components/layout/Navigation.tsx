"use client";

import { useState, useEffect } from "react";
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
  Search,
  BarChart3,
  AlertCircle,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Início", icon: Home },
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
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
            ? "bg-brutal-bg border-b-3 border-black shadow-hard"
            : "bg-brutal-bg border-b-3 border-black"
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
                        ? "bg-black text-white border-2 border-black"
                        : "hover:bg-black hover:text-white border-2 border-transparent hover:border-black"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

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

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t-3 border-black bg-white">
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 font-bold uppercase border-2 border-black transition-all ${
                      active ? "bg-black text-white" : "bg-white hover:bg-black hover:text-white"
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
