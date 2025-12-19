// Tipos gerados para o banco de dados Supabase
// Baseado no schema.sql

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          quiz_streak: number;
          last_quiz_date: string | null;
          total_quizzes_completed: number;
          is_premium: boolean;
          is_admin: boolean;
          subscription_plan: "gratuito" | "basico" | "pro";
          subscription_expires_at: string | null;
          subscription_pix_id: string | null;
        };
        Insert: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          quiz_streak?: number;
          last_quiz_date?: string | null;
          total_quizzes_completed?: number;
          is_premium?: boolean;
          is_admin?: boolean;
          subscription_plan?: "gratuito" | "basico" | "pro";
          subscription_expires_at?: string | null;
          subscription_pix_id?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          quiz_streak?: number;
          last_quiz_date?: string | null;
          total_quizzes_completed?: number;
          is_premium?: boolean;
          is_admin?: boolean;
          subscription_plan?: "gratuito" | "basico" | "pro";
          subscription_expires_at?: string | null;
          subscription_pix_id?: string | null;
        };
      };
      political_dimensions: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          left_label: string;
          right_label: string;
          icon: string | null;
          sort_order: number;
        };
        Insert: {
          id: string;
          name: string;
          description?: string | null;
          left_label: string;
          right_label: string;
          icon?: string | null;
          sort_order?: number;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          left_label?: string;
          right_label?: string;
          icon?: string | null;
          sort_order?: number;
        };
      };
      quiz_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string | null;
          color: string;
        };
        Insert: {
          id: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          color?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          color?: string;
        };
      };
      quiz_questions: {
        Row: {
          id: string;
          category_id: string | null;
          question_text: string;
          question_type: "multiple_choice" | "scale" | "agree_disagree" | "ranking";
          options: Json | null;
          correct_answer: string | null;
          explanation: string | null;
          source_url: string | null;
          difficulty: number;
          dimension_impacts: Json | null;
          is_active: boolean;
          is_daily: boolean;
          daily_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          question_text: string;
          question_type: "multiple_choice" | "scale" | "agree_disagree" | "ranking";
          options?: Json | null;
          correct_answer?: string | null;
          explanation?: string | null;
          source_url?: string | null;
          difficulty?: number;
          dimension_impacts?: Json | null;
          is_active?: boolean;
          is_daily?: boolean;
          daily_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          question_text?: string;
          question_type?: "multiple_choice" | "scale" | "agree_disagree" | "ranking";
          options?: Json | null;
          correct_answer?: string | null;
          explanation?: string | null;
          source_url?: string | null;
          difficulty?: number;
          dimension_impacts?: Json | null;
          is_active?: boolean;
          is_daily?: boolean;
          daily_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_quiz_responses: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          answer: Json;
          is_correct: boolean | null;
          time_taken_ms: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          answer: Json;
          is_correct?: boolean | null;
          time_taken_ms?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question_id?: string;
          answer?: Json;
          is_correct?: boolean | null;
          time_taken_ms?: number | null;
          created_at?: string;
        };
      };
      user_political_values: {
        Row: {
          id: string;
          user_id: string;
          dimension_id: string;
          score: number;
          confidence: number;
          is_manual: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          dimension_id: string;
          score: number;
          confidence?: number;
          is_manual?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          dimension_id?: string;
          score?: number;
          confidence?: number;
          is_manual?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      politician_profiles: {
        Row: {
          id: string;
          deputado_id: number;
          deputado_nome: string;
          deputado_partido: string | null;
          deputado_uf: string | null;
          deputado_foto_url: string | null;
          dimension_id: string;
          score: number;
          confidence: number;
          votacoes_analisadas: number;
          ultima_atualizacao: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          deputado_id: number;
          deputado_nome: string;
          deputado_partido?: string | null;
          deputado_uf?: string | null;
          deputado_foto_url?: string | null;
          dimension_id: string;
          score: number;
          confidence?: number;
          votacoes_analisadas?: number;
          ultima_atualizacao?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          deputado_id?: number;
          deputado_nome?: string;
          deputado_partido?: string | null;
          deputado_uf?: string | null;
          deputado_foto_url?: string | null;
          dimension_id?: string;
          score?: number;
          confidence?: number;
          votacoes_analisadas?: number;
          ultima_atualizacao?: string;
          created_at?: string;
        };
      };
      user_politician_matches: {
        Row: {
          id: string;
          user_id: string;
          deputado_id: number;
          match_score: number;
          dimension_breakdown: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          deputado_id: number;
          match_score: number;
          dimension_breakdown?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          deputado_id?: number;
          match_score?: number;
          dimension_breakdown?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      daily_quiz_completions: {
        Row: {
          id: string;
          user_id: string;
          quiz_date: string;
          questions_answered: number;
          correct_answers: number;
          score: number | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_date: string;
          questions_answered?: number;
          correct_answers?: number;
          score?: number | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          quiz_date?: string;
          questions_answered?: number;
          correct_answers?: number;
          score?: number | null;
          completed_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

// Tipos auxiliares para uso no código
export type User = Database["public"]["Tables"]["users"]["Row"];
export type PoliticalDimension = Database["public"]["Tables"]["political_dimensions"]["Row"];
export type QuizCategory = Database["public"]["Tables"]["quiz_categories"]["Row"];
export type QuizQuestion = Database["public"]["Tables"]["quiz_questions"]["Row"];
export type UserQuizResponse = Database["public"]["Tables"]["user_quiz_responses"]["Row"];
export type UserPoliticalValue = Database["public"]["Tables"]["user_political_values"]["Row"];
export type PoliticianProfile = Database["public"]["Tables"]["politician_profiles"]["Row"];
export type UserPoliticianMatch = Database["public"]["Tables"]["user_politician_matches"]["Row"];
export type DailyQuizCompletion = Database["public"]["Tables"]["daily_quiz_completions"]["Row"];

// Tipos para opções de quiz
export type QuizOption = {
  id: string;
  text: string;
  is_correct?: boolean;
  dimension_impacts?: Array<{
    dimension: string;
    impact: number;
  }>;
};

// Tipos para impacto dimensional
export type DimensionImpact = {
  dimension_id: string;
  left_weight: number;
  right_weight: number;
};

// Tipo para resposta do quiz agree/disagree
export type AgreeDisagreeAnswer = "strongly_disagree" | "disagree" | "neutral" | "agree" | "strongly_agree";

// Tipo para breakdown de match
export type MatchDimensionBreakdown = {
  dimension_id: string;
  dimension_name: string;
  user_score: number;
  politician_score: number;
  difference: number;
};
