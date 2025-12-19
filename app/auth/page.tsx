"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

type AuthMode = "login" | "register" | "forgot";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/quiz";

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Verificar se já está logado
  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          router.push(redirectTo);
        }
      });
    }
  }, [router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (!isSupabaseConfigured()) {
      setError("Supabase não está configurado. Configure as variáveis de ambiente.");
      setIsLoading(false);
      return;
    }

    try {
      if (mode === "register") {
        // Validações
        if (password !== confirmPassword) {
          throw new Error("As senhas não coincidem");
        }
        if (password.length < 6) {
          throw new Error("A senha deve ter pelo menos 6 caracteres");
        }

        // Criar conta
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName || email.split("@")[0],
            },
          },
        });

        if (signUpError) throw signUpError;

        // O registro na tabela users será criado automaticamente pelo AuthContext
        // quando o usuário fizer login pela primeira vez

        // Verificar se precisa confirmar email
        if (data.session) {
          // Login automático - redirecionar
          router.push(redirectTo);
        } else {
          // Precisa confirmar email
          setSuccess("Conta criada! Verifique seu email para confirmar o cadastro.");
          setMode("login");
        }
      } else if (mode === "login") {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (data.session) {
          // O AuthContext cuidará de atualizar/criar o usuário na tabela users
          router.push(redirectTo);
        }
      } else if (mode === "forgot") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset`,
        });

        if (resetError) throw resetError;

        setSuccess("Email de recuperação enviado! Verifique sua caixa de entrada.");
      }
    } catch (err: any) {
      console.error("Erro de autenticação:", err);

      // Traduzir mensagens de erro comuns
      const errorMessages: Record<string, string> = {
        "Invalid login credentials": "Email ou senha incorretos",
        "User already registered": "Este email já está cadastrado",
        "Password should be at least 6 characters":
          "A senha deve ter pelo menos 6 caracteres",
        "Unable to validate email address: invalid format": "Formato de email inválido",
        "Email not confirmed": "Email não confirmado. Verifique sua caixa de entrada.",
      };

      setError(errorMessages[err.message] || err.message || "Ocorreu um erro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    if (!isSupabaseConfigured()) {
      setError("Supabase não está configurado");
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login social");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-brutal-bg dark:bg-brutal-dark-bg">
      <div className="w-full max-w-md">
        {/* Voltar */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-brutal-dark-muted hover:text-black dark:hover:text-white mb-6"
        >
          <ArrowLeft size={16} />
          Voltar ao início
        </Link>

        {/* Card Principal */}
        <div className="card-brutal bg-white dark:bg-brutal-dark-surface p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-black text-white dark:bg-brutal-dark-accent px-4 py-2 font-black text-2xl mb-4">
              PSF
            </div>
            <h1 className="text-2xl font-black uppercase dark:text-brutal-dark-text">
              {mode === "login" && "Entrar"}
              {mode === "register" && "Criar Conta"}
              {mode === "forgot" && "Recuperar Senha"}
            </h1>
            <p className="text-sm text-gray-600 dark:text-brutal-dark-muted mt-2">
              {mode === "login" && "Acesse sua conta para continuar"}
              {mode === "register" && "Crie sua conta para acompanhar políticos"}
              {mode === "forgot" && "Digite seu email para recuperar a senha"}
            </p>
          </div>

          {/* Mensagens */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border-2 border-green-500 flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome (apenas no cadastro) */}
            {mode === "register" && (
              <div>
                <label className="block text-sm font-bold uppercase mb-2 dark:text-brutal-dark-text">
                  Nome
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Como quer ser chamado?"
                    className="w-full pl-10 pr-4 py-3 border-3 border-black dark:border-brutal-dark-border bg-white dark:bg-brutal-dark-bg font-bold focus:outline-none focus:ring-2 focus:ring-brutal-yellow dark:text-brutal-dark-text"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-bold uppercase mb-2 dark:text-brutal-dark-text">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border-3 border-black dark:border-brutal-dark-border bg-white dark:bg-brutal-dark-bg font-bold focus:outline-none focus:ring-2 focus:ring-brutal-yellow dark:text-brutal-dark-text"
                />
              </div>
            </div>

            {/* Senha (não no forgot) */}
            {mode !== "forgot" && (
              <div>
                <label className="block text-sm font-bold uppercase mb-2 dark:text-brutal-dark-text">
                  Senha
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-12 py-3 border-3 border-black dark:border-brutal-dark-border bg-white dark:bg-brutal-dark-bg font-bold focus:outline-none focus:ring-2 focus:ring-brutal-yellow dark:text-brutal-dark-text"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirmar senha (apenas no cadastro) */}
            {mode === "register" && (
              <div>
                <label className="block text-sm font-bold uppercase mb-2 dark:text-brutal-dark-text">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-3 border-3 border-black dark:border-brutal-dark-border bg-white dark:bg-brutal-dark-bg font-bold focus:outline-none focus:ring-2 focus:ring-brutal-yellow dark:text-brutal-dark-text"
                  />
                </div>
              </div>
            )}

            {/* Link esqueci senha */}
            {mode === "login" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot");
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-sm font-bold text-gray-600 dark:text-brutal-dark-muted hover:text-black dark:hover:text-white"
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-brutal bg-brutal-yellow dark:bg-brutal-dark-accent text-black dark:text-white py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {mode === "login" && "Entrar"}
                  {mode === "register" && "Criar Conta"}
                  {mode === "forgot" && "Enviar Email"}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Divisor */}
          {mode !== "forgot" && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-300 dark:border-brutal-dark-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-brutal-dark-surface font-bold text-gray-500 dark:text-brutal-dark-muted">
                    ou continue com
                  </span>
                </div>
              </div>

              {/* Login Social */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleSocialLogin("google")}
                  className="btn-brutal bg-white dark:bg-brutal-dark-bg py-3 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="font-bold text-sm dark:text-brutal-dark-text">Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin("github")}
                  className="btn-brutal bg-white dark:bg-brutal-dark-bg py-3 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="font-bold text-sm dark:text-brutal-dark-text">GitHub</span>
                </button>
              </div>
            </>
          )}

          {/* Toggle Login/Cadastro */}
          <div className="mt-8 text-center">
            {mode === "login" && (
              <p className="text-sm dark:text-brutal-dark-text">
                Não tem conta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError(null);
                    setSuccess(null);
                  }}
                  className="font-bold text-brutal-blue hover:underline"
                >
                  Criar conta
                </button>
              </p>
            )}
            {mode === "register" && (
              <p className="text-sm dark:text-brutal-dark-text">
                Já tem conta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                    setSuccess(null);
                  }}
                  className="font-bold text-brutal-blue hover:underline"
                >
                  Fazer login
                </button>
              </p>
            )}
            {mode === "forgot" && (
              <p className="text-sm dark:text-brutal-dark-text">
                Lembrou a senha?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                    setSuccess(null);
                  }}
                  className="font-bold text-brutal-blue hover:underline"
                >
                  Voltar ao login
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Termos */}
        <p className="text-xs text-center text-gray-500 dark:text-brutal-dark-muted mt-6">
          Ao criar uma conta, você concorda com nossos{" "}
          <Link href="/termos" className="underline hover:text-black dark:hover:text-white">
            Termos de Uso
          </Link>{" "}
          e{" "}
          <Link href="/privacidade" className="underline hover:text-black dark:hover:text-white">
            Política de Privacidade
          </Link>
        </p>
      </div>
    </main>
  );
}

// Loading fallback
function AuthLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-brutal-bg dark:bg-brutal-dark-bg">
      <div className="text-center">
        <Loader2 size={48} className="animate-spin mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 dark:text-brutal-dark-muted font-bold">Carregando...</p>
      </div>
    </main>
  );
}

// Exportação com Suspense
export default function AuthPage() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <AuthContent />
    </Suspense>
  );
}
