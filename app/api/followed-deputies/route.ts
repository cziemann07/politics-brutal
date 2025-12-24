import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  getFollowedDeputies,
  followDeputy,
  unfollowDeputy,
} from "@/lib/notifications";

// Cliente Supabase para verificar autenticação
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * GET /api/followed-deputies
 * 
 * Lista deputados seguidos pelo usuário autenticado.
 */
export async function GET(request: NextRequest) {
  try {
    // Verifica autenticação
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Busca deputados seguidos
    const deputies = await getFollowedDeputies(user.id);

    return NextResponse.json({
      success: true,
      deputies,
      count: deputies.length,
    });
  } catch (error) {
    console.error("[Followed Deputies] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao buscar deputados", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/followed-deputies
 * 
 * Segue um deputado.
 * 
 * Body:
 * - id: ID do deputado
 * - nome: Nome do deputado
 * - partido: Sigla do partido (opcional)
 * - uf: UF (opcional)
 * - urlFoto: URL da foto (opcional)
 */
export async function POST(request: NextRequest) {
  try {
    // Verifica autenticação
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { id, nome, partido, uf, urlFoto } = body;

    if (!id || !nome) {
      return NextResponse.json(
        { error: "id e nome são obrigatórios" },
        { status: 400 }
      );
    }

    // Verifica limite do plano do usuário
    const currentDeputies = await getFollowedDeputies(user.id);
    
    // Busca informações do plano do usuário
    const { data: userData } = await supabase
      .from("users")
      .select("subscription_plan, is_admin")
      .eq("id", user.id)
      .single();

    const plan = userData?.subscription_plan || "gratuito";
    const isAdmin = userData?.is_admin || false;

    // Limites por plano
    const limits: Record<string, number> = {
      gratuito: 1,
      basico: 3,
      pro: 15,
    };

    const limite = isAdmin ? 999 : (limits[plan] || 1);

    if (currentDeputies.length >= limite) {
      return NextResponse.json(
        { 
          error: "Limite de deputados atingido",
          limite,
          atual: currentDeputies.length,
          plano: plan,
        },
        { status: 403 }
      );
    }

    // Segue o deputado
    const deputy = await followDeputy(user.id, {
      id,
      nome,
      partido,
      uf,
      urlFoto,
    });

    if (!deputy) {
      return NextResponse.json(
        { error: "Erro ao seguir deputado" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      deputy,
    });
  } catch (error) {
    console.error("[Followed Deputies] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao seguir deputado", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/followed-deputies
 * 
 * Deixa de seguir um deputado.
 * 
 * Query params:
 * - deputadoId: ID do deputado
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verifica autenticação
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const deputadoIdStr = searchParams.get("deputadoId");

    if (!deputadoIdStr) {
      return NextResponse.json(
        { error: "deputadoId é obrigatório" },
        { status: 400 }
      );
    }

    const deputadoId = parseInt(deputadoIdStr, 10);

    // Deixa de seguir
    const success = await unfollowDeputy(user.id, deputadoId);

    if (!success) {
      return NextResponse.json(
        { error: "Erro ao deixar de seguir" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Followed Deputies] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao deixar de seguir", details: String(error) },
      { status: 500 }
    );
  }
}

