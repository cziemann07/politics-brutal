"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";
import type { User } from "@/types/database";

type AuthUser = {
  id: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  isAnonymous: boolean;
  isPremium: boolean;
  quizStreak: number;
  totalQuizzesCompleted: number;
};

type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isSupabaseReady: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Converte dados do Supabase para AuthUser
function mapSupabaseUserToAuthUser(
  supabaseUser: SupabaseUser,
  dbUser: User | null
): AuthUser {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || null,
    displayName:
      dbUser?.display_name ||
      supabaseUser.user_metadata?.display_name ||
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.email?.split("@")[0] ||
      null,
    avatarUrl:
      dbUser?.avatar_url ||
      supabaseUser.user_metadata?.avatar_url ||
      null,
    isAnonymous: false,
    isPremium: dbUser?.is_premium || false,
    quizStreak: dbUser?.quiz_streak || 0,
    totalQuizzesCompleted: dbUser?.total_quizzes_completed || 0,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isSupabaseReady = isSupabaseConfigured();

  // Função para buscar dados do usuário no banco
  const fetchUserFromDb = async (userId: string): Promise<User | null> => {
    if (!isSupabaseReady) return null;

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // Usuário não existe no banco ainda
        if (error.code === "PGRST116") {
          return null;
        }
        console.error("Erro ao buscar usuário:", error);
        return null;
      }

      return data;
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      return null;
    }
  };

  // Função para criar/atualizar usuário no banco
  const ensureUserInDb = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    if (!isSupabaseReady) return null;

    try {
      // Verificar se usuário já existe
      let dbUser = await fetchUserFromDb(supabaseUser.id);

      if (!dbUser) {
        // Criar usuário
        const { data, error } = await supabase
          .from("users")
          .insert({
            id: supabaseUser.id,
            email: supabaseUser.email,
            display_name:
              supabaseUser.user_metadata?.display_name ||
              supabaseUser.user_metadata?.full_name ||
              supabaseUser.email?.split("@")[0],
            avatar_url: supabaseUser.user_metadata?.avatar_url,
          })
          .select()
          .single();

        if (error) {
          console.error("Erro ao criar usuário:", error);
          return null;
        }

        dbUser = data;
      }

      return dbUser;
    } catch (err) {
      console.error("Erro ao garantir usuário no banco:", err);
      return null;
    }
  };

  // Atualiza o estado do usuário
  const updateUserState = async (supabaseUser: SupabaseUser | null, newSession: Session | null) => {
    setSession(newSession);

    if (supabaseUser) {
      const dbUser = await ensureUserInDb(supabaseUser);
      const authUser = mapSupabaseUserToAuthUser(supabaseUser, dbUser);
      setUser(authUser);

      // Salvar no localStorage para persistência
      localStorage.setItem("politics-brutal-user", JSON.stringify(authUser));
    } else {
      setUser(null);
      localStorage.removeItem("politics-brutal-user");
    }
  };

  // Inicialização
  useEffect(() => {
    const initialize = async () => {
      if (!isSupabaseReady) {
        // Carregar usuário do localStorage se Supabase não está configurado
        const saved = localStorage.getItem("politics-brutal-user");
        if (saved) {
          try {
            setUser(JSON.parse(saved));
          } catch {
            // Ignora erro de parse
          }
        }
        setIsLoading(false);
        return;
      }

      // Buscar sessão atual
      const { data: { session: currentSession } } = await supabase.auth.getSession();

      if (currentSession?.user) {
        await updateUserState(currentSession.user, currentSession);
      }

      setIsLoading(false);

      // Listener para mudanças de autenticação
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log("Auth event:", event);

          if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
            if (newSession?.user) {
              await updateUserState(newSession.user, newSession);
            }
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            setSession(null);
            localStorage.removeItem("politics-brutal-user");
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    };

    initialize();
  }, [isSupabaseReady]);

  // Função para fazer logout
  const signOut = async () => {
    if (isSupabaseReady) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    localStorage.removeItem("politics-brutal-user");
  };

  // Função para atualizar dados do usuário
  const refreshUser = async () => {
    if (!isSupabaseReady || !session?.user) return;

    const dbUser = await fetchUserFromDb(session.user.id);
    if (dbUser) {
      const authUser = mapSupabaseUserToAuthUser(session.user, dbUser);
      setUser(authUser);
      localStorage.setItem("politics-brutal-user", JSON.stringify(authUser));
    }
  };

  // Função para atualizar perfil do usuário
  const updateUserProfile = async (data: Partial<User>) => {
    if (!isSupabaseReady || !user) return;

    const { error } = await supabase
      .from("users")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }

    // Atualizar estado local
    await refreshUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isSupabaseReady,
        signOut,
        refreshUser,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
