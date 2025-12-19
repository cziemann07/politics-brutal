"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export type VoteType = "up" | "down" | null;

interface VoteData {
  upvotes: number;
  downvotes: number;
  userVote: VoteType;
}

interface UseVotesReturn {
  votes: Record<number, VoteData>;
  vote: (noticiaId: number, type: "up" | "down") => Promise<void>;
  isLoading: boolean;
  requiresLogin: boolean;
}

const LOCAL_STORAGE_KEY = "politics-brutal-votes";

// Carrega votos do localStorage
function getLocalVotes(): Record<number, VoteType> {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

// Salva votos no localStorage
function saveLocalVotes(votes: Record<number, VoteType>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(votes));
}

export function useVotes(noticiaIds: number[]): UseVotesReturn {
  const { user, isSupabaseReady } = useAuth();
  const [votes, setVotes] = useState<Record<number, VoteData>>({});
  const [localVotes, setLocalVotes] = useState<Record<number, VoteType>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [requiresLogin, setRequiresLogin] = useState(false);

  // Inicializa os votos locais
  useEffect(() => {
    const saved = getLocalVotes();
    setLocalVotes(saved);
  }, []);

  // Carrega votos do Supabase
  useEffect(() => {
    const loadVotes = async () => {
      setIsLoading(true);

      // Inicializa votos com valores zerados
      const initialVotes: Record<number, VoteData> = {};
      noticiaIds.forEach((id) => {
        initialVotes[id] = {
          upvotes: 0,
          downvotes: 0,
          userVote: localVotes[id] || null,
        };
      });

      if (isSupabaseReady) {
        try {
          // Busca contagem de votos
          const { data: voteCounts, error: countError } = await supabase
            .from("news_votes")
            .select("noticia_id, vote_type")
            .in("noticia_id", noticiaIds);

          if (!countError && voteCounts) {
            voteCounts.forEach((vote) => {
              if (initialVotes[vote.noticia_id]) {
                if (vote.vote_type === "up") {
                  initialVotes[vote.noticia_id].upvotes++;
                } else if (vote.vote_type === "down") {
                  initialVotes[vote.noticia_id].downvotes++;
                }
              }
            });
          }

          // Se usuário está logado, busca seus votos
          if (user) {
            const { data: userVotes, error: userError } = await supabase
              .from("news_votes")
              .select("noticia_id, vote_type")
              .eq("user_id", user.id)
              .in("noticia_id", noticiaIds);

            if (!userError && userVotes) {
              userVotes.forEach((vote) => {
                if (initialVotes[vote.noticia_id]) {
                  initialVotes[vote.noticia_id].userVote = vote.vote_type as VoteType;
                }
              });
            }
          }
        } catch (error) {
          console.error("Erro ao carregar votos:", error);
        }
      }

      setVotes(initialVotes);
      setIsLoading(false);
    };

    if (noticiaIds.length > 0) {
      loadVotes();
    } else {
      setIsLoading(false);
    }
  }, [noticiaIds, user, isSupabaseReady, localVotes]);

  // Função para votar
  const vote = useCallback(
    async (noticiaId: number, type: "up" | "down") => {
      const currentVote = votes[noticiaId]?.userVote;

      // Se o usuário não está logado, pede login
      if (!user) {
        setRequiresLogin(true);
        return;
      }

      // Calcula novo estado do voto
      let newVote: VoteType;
      if (currentVote === type) {
        // Se clicou no mesmo botão, remove o voto
        newVote = null;
      } else {
        // Muda ou adiciona voto
        newVote = type;
      }

      // Atualiza estado local imediatamente (otimistic update)
      setVotes((prev) => {
        const current = prev[noticiaId] || { upvotes: 0, downvotes: 0, userVote: null };
        let upvotes = current.upvotes;
        let downvotes = current.downvotes;

        // Remove voto anterior
        if (currentVote === "up") upvotes--;
        if (currentVote === "down") downvotes--;

        // Adiciona novo voto
        if (newVote === "up") upvotes++;
        if (newVote === "down") downvotes++;

        return {
          ...prev,
          [noticiaId]: {
            upvotes: Math.max(0, upvotes),
            downvotes: Math.max(0, downvotes),
            userVote: newVote,
          },
        };
      });

      // Salva no Supabase
      if (isSupabaseReady && user) {
        try {
          if (newVote === null) {
            // Remove o voto
            await supabase
              .from("news_votes")
              .delete()
              .eq("user_id", user.id)
              .eq("noticia_id", noticiaId);
          } else {
            // Upsert: insere ou atualiza
            await supabase.from("news_votes").upsert(
              {
                user_id: user.id,
                noticia_id: noticiaId,
                vote_type: newVote,
                updated_at: new Date().toISOString(),
              },
              {
                onConflict: "user_id,noticia_id",
              }
            );
          }
        } catch (error) {
          console.error("Erro ao salvar voto:", error);
          // Reverte o estado em caso de erro
          setVotes((prev) => ({
            ...prev,
            [noticiaId]: {
              ...prev[noticiaId],
              userVote: currentVote,
            },
          }));
        }
      }
    },
    [votes, user, isSupabaseReady]
  );

  // Reseta o estado de requiresLogin
  useEffect(() => {
    if (user) {
      setRequiresLogin(false);
    }
  }, [user]);

  return { votes, vote, isLoading, requiresLogin };
}
