import { NextResponse } from "next/server";

/**
 * PIX Configuration API
 * Returns PIX payment configuration from server-side env vars.
 * This prevents hardcoding sensitive payment info in the client bundle.
 */

interface PixConfig {
    chavePix: string;
    nomeRecebedor: string;
    cidade: string;
}

export async function GET() {
    // Get PIX config from environment variables
    const chavePix = process.env.PIX_KEY;
    const nomeRecebedor = process.env.PIX_RECEIVER_NAME || "Politics Brutal";
    const cidade = process.env.PIX_CITY || "Brazil";

    if (!chavePix) {
        // In development, return a placeholder warning
        if (process.env.NODE_ENV !== "production") {
            return NextResponse.json({
                chavePix: "00000000000", // Placeholder
                nomeRecebedor: "CONFIGURE_PIX_KEY",
                cidade: "DEV",
                warning: "PIX_KEY not configured in .env.local",
            });
        }

        return NextResponse.json(
            { error: "PIX configuration not available" },
            { status: 503 }
        );
    }

    const config: PixConfig = {
        chavePix,
        nomeRecebedor,
        cidade,
    };

    return NextResponse.json(config);
}
