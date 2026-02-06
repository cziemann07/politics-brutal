"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    AlertCircle,
    CheckCircle,
    Loader2,
    ArrowLeft,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

function ResetPasswordContent() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Check if we have a valid session (came from email link)
    useEffect(() => {
        if (!isSupabaseConfigured()) return;

        // Supabase handles the token from the URL automatically
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                setError("Link inválido ou expirado. Solicite um novo link de recuperação.");
            }
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!isSupabaseConfigured()) {
            setError("Supabase não está configurado.");
            setIsLoading(false);
            return;
        }

        // Validations
        if (password !== confirmPassword) {
            setError("As senhas não coincidem");
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres");
            setIsLoading(false);
            return;
        }

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password,
            });

            if (updateError) throw updateError;

            setSuccess(true);

            // Redirect to home after 3 seconds
            setTimeout(() => {
                router.push("/");
            }, 3000);
        } catch (err: any) {
            console.error("Erro ao redefinir senha:", err);
            setError(err.message || "Erro ao redefinir senha. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <main className="min-h-screen flex items-center justify-center p-4 bg-brutal-bg dark:bg-brutal-dark-bg">
                <div className="w-full max-w-md">
                    <div className="card-brutal bg-white dark:bg-brutal-dark-surface p-8 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle size={40} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-black uppercase mb-2 dark:text-brutal-dark-text">
                            Senha Atualizada!
                        </h2>
                        <p className="text-gray-600 dark:text-brutal-dark-muted mb-4">
                            Sua senha foi redefinida com sucesso. Redirecionando...
                        </p>
                        <Link
                            href="/"
                            className="btn-brutal bg-brutal-yellow dark:bg-brutal-dark-accent text-black dark:text-white inline-flex items-center gap-2"
                        >
                            Ir para o início
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-brutal-bg dark:bg-brutal-dark-bg">
            <div className="w-full max-w-md">
                {/* Back Link */}
                <Link
                    href="/auth"
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-brutal-dark-muted hover:text-black dark:hover:text-white mb-6"
                >
                    <ArrowLeft size={16} />
                    Voltar ao login
                </Link>

                {/* Main Card */}
                <div className="card-brutal bg-white dark:bg-brutal-dark-surface p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-block bg-black text-white dark:bg-brutal-dark-accent px-4 py-2 font-black text-2xl mb-4">
                            PSF
                        </div>
                        <h1 className="text-2xl font-black uppercase dark:text-brutal-dark-text">
                            Redefinir Senha
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-brutal-dark-muted mt-2">
                            Digite sua nova senha abaixo
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 flex items-start gap-3">
                            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-bold uppercase mb-2 dark:text-brutal-dark-text">
                                Nova Senha
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
                                    placeholder="Mínimo 6 caracteres"
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

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-bold uppercase mb-2 dark:text-brutal-dark-text">
                                Confirmar Nova Senha
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
                                    placeholder="Repita a nova senha"
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-3 border-3 border-black dark:border-brutal-dark-border bg-white dark:bg-brutal-dark-bg font-bold focus:outline-none focus:ring-2 focus:ring-brutal-yellow dark:text-brutal-dark-text"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-brutal bg-brutal-yellow dark:bg-brutal-dark-accent text-black dark:text-white py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    Redefinir Senha
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}

// Loading fallback
function ResetLoading() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-brutal-bg dark:bg-brutal-dark-bg">
            <div className="text-center">
                <Loader2 size={48} className="animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-brutal-dark-muted font-bold">Carregando...</p>
            </div>
        </main>
    );
}

// Export with Suspense
export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<ResetLoading />}>
            <ResetPasswordContent />
        </Suspense>
    );
}
