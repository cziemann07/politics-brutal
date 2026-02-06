"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Legacy /login route redirect.
 * Redirects to canonical /auth for backwards compatibility.
 */
export default function LoginRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/auth");
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-brutal-bg dark:bg-brutal-dark-bg">
            <p className="font-bold text-gray-600 dark:text-brutal-dark-muted">
                Redirecionando para login...
            </p>
        </div>
    );
}
