import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout";
import { ThemeProvider, AuthProvider } from "@/contexts";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Radar sem Filtro - Acompanhe seus políticos",
  description:
    "Acompanhe deputados brasileiros: gastos, votações, presenças e mais. Transparência política para o cidadão.",
  keywords: ["política", "deputados", "transparência", "brasil", "câmara", "votações", "gastos públicos"],
  authors: [{ name: "Radar sem Filtro" }],
  openGraph: {
    title: "Radar sem Filtro",
    description: "Acompanhe seus políticos de verdade",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
