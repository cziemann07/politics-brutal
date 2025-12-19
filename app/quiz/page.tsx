"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Brain,
  Compass,
  ScrollText,
  AlertTriangle,
  Flame,
  Trophy,
  RotateCcw,
  Share2,
  ArrowRight,
  CheckCircle,
  Lock,
} from "lucide-react";
import { QuizCard, QuizProgress, PoliticalValuesResult } from "@/components/quiz";
import { useQuiz } from "@/hooks/useQuiz";
import type { QuizQuestion, UserPoliticalValue } from "@/types/database";

// Perguntas locais para funcionar sem Supabase
const LOCAL_VALUES_QUESTIONS: QuizQuestion[] = [
  {
    id: "val_1",
    category_id: "valores",
    question_text:
      "O Estado deve ter mais controle sobre empresas estratégicas como Petrobras e Banco do Brasil.",
    question_type: "agree_disagree",
    options: null,
    correct_answer: null,
    explanation: "Esta questão mede sua posição sobre intervenção estatal na economia.",
    source_url: null,
    difficulty: 1,
    dimension_impacts: [{ dimension_id: "economia", left_weight: 1, right_weight: 0 }],
    is_active: true,
    is_daily: false,
    daily_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "val_2",
    category_id: "valores",
    question_text: "Privatizações são geralmente benéficas para a economia e para os consumidores.",
    question_type: "agree_disagree",
    options: null,
    correct_answer: null,
    explanation: "Esta questão mede sua posição sobre livre mercado vs. estatização.",
    source_url: null,
    difficulty: 1,
    dimension_impacts: [{ dimension_id: "economia", left_weight: 0, right_weight: 1 }],
    is_active: true,
    is_daily: false,
    daily_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "val_3",
    category_id: "valores",
    question_text:
      "Programas de transferência de renda como o Bolsa Família são essenciais para reduzir a desigualdade.",
    question_type: "agree_disagree",
    options: null,
    correct_answer: null,
    explanation: "Esta questão mede sua posição sobre políticas redistributivas.",
    source_url: null,
    difficulty: 1,
    dimension_impacts: [{ dimension_id: "economia", left_weight: 1, right_weight: 0 }],
    is_active: true,
    is_daily: false,
    daily_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "val_4",
    category_id: "valores",
    question_text:
      "A família tradicional (pai, mãe e filhos) deve ser protegida e incentivada pelo Estado.",
    question_type: "agree_disagree",
    options: null,
    correct_answer: null,
    explanation: "Esta questão mede sua posição sobre valores familiares tradicionais.",
    source_url: null,
    difficulty: 1,
    dimension_impacts: [{ dimension_id: "social", left_weight: 0, right_weight: 1 }],
    is_active: true,
    is_daily: false,
    daily_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "val_5",
    category_id: "valores",
    question_text:
      "Casais homoafetivos devem ter os mesmos direitos que casais heterossexuais, incluindo adoção.",
    question_type: "agree_disagree",
    options: null,
    correct_answer: null,
    explanation: "Esta questão mede sua posição sobre direitos LGBTQ+.",
    source_url: null,
    difficulty: 1,
    dimension_impacts: [{ dimension_id: "social", left_weight: 1, right_weight: 0 }],
    is_active: true,
    is_daily: false,
    daily_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "val_6",
    category_id: "valores",
    question_text:
      "A preservação ambiental deve ser prioridade mesmo que isso limite o crescimento econômico.",
    question_type: "agree_disagree",
    options: null,
    correct_answer: null,
    explanation: "Esta questão mede sua posição sobre meio ambiente vs. desenvolvimento.",
    source_url: null,
    difficulty: 1,
    dimension_impacts: [{ dimension_id: "ambiental", left_weight: 1, right_weight: 0 }],
    is_active: true,
    is_daily: false,
    daily_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "val_7",
    category_id: "valores",
    question_text: "O Brasil deveria flexibilizar leis ambientais para aumentar a produção agrícola.",
    question_type: "agree_disagree",
    options: null,
    correct_answer: null,
    explanation: "Esta questão mede sua posição sobre agronegócio e meio ambiente.",
    source_url: null,
    difficulty: 1,
    dimension_impacts: [{ dimension_id: "ambiental", left_weight: 0, right_weight: 1 }],
    is_active: true,
    is_daily: false,
    daily_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "val_8",
    category_id: "valores",
    question_text: "A redução da maioridade penal ajudaria a diminuir a criminalidade no Brasil.",
    question_type: "agree_disagree",
    options: null,
    correct_answer: null,
    explanation: "Esta questão mede sua posição sobre punitivismo.",
    source_url: null,
    difficulty: 1,
    dimension_impacts: [{ dimension_id: "seguranca", left_weight: 0, right_weight: 1 }],
    is_active: true,
    is_daily: false,
    daily_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "val_9",
    category_id: "valores",
    question_text: "A posse e o porte de armas de fogo devem ser facilitados para cidadãos de bem.",
    question_type: "agree_disagree",
    options: null,
    correct_answer: null,
    explanation: "Esta questão mede sua posição sobre armamento civil.",
    source_url: null,
    difficulty: 1,
    dimension_impacts: [{ dimension_id: "seguranca", left_weight: 0, right_weight: 1 }],
    is_active: true,
    is_daily: false,
    daily_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "val_10",
    category_id: "valores",
    question_text:
      "Os salários e gastos de todos os servidores públicos devem ser totalmente públicos.",
    question_type: "agree_disagree",
    options: null,
    correct_answer: null,
    explanation: "Esta questão mede sua posição sobre transparência governamental.",
    source_url: null,
    difficulty: 1,
    dimension_impacts: [{ dimension_id: "transparencia", left_weight: 1, right_weight: 0 }],
    is_active: true,
    is_daily: false,
    daily_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const LOCAL_KNOWLEDGE_QUESTIONS: QuizQuestion[] = [
  {
    id: "know_1",
    category_id: "votacoes",
    question_text:
      "Em 2016, qual foi o resultado da votação de impeachment de Dilma Rousseff na Câmara?",
    question_type: "multiple_choice",
    options: [
      { id: "a", text: "367 a favor, 137 contra" },
      { id: "b", text: "342 a favor, 150 contra" },
      { id: "c", text: "400 a favor, 100 contra" },
      { id: "d", text: "300 a favor, 200 contra" },
    ],
    correct_answer: "a",
    explanation:
      "O impeachment foi aprovado com 367 votos a favor e 137 contra, superando os 342 necessários (2/3 dos deputados).",
    source_url: null,
    difficulty: 3,
    dimension_impacts: null,
    is_active: true,
    is_daily: false,
    daily_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "know_2",
    category_id: "escandalos",
    question_text: "Qual foi o escândalo que revelou o esquema de corrupção na Petrobras?",
    question_type: "multiple_choice",
    options: [
      { id: "a", text: "Mensalão" },
      { id: "b", text: "Lava Jato" },
      { id: "c", text: "Banestado" },
      { id: "d", text: "Satiagraha" },
    ],
    correct_answer: "b",
    explanation:
      "A Operação Lava Jato, iniciada em 2014, revelou um esquema bilionário de corrupção envolvendo a Petrobras.",
    source_url: null,
    difficulty: 1,
    dimension_impacts: null,
    is_active: true,
    is_daily: false,
    daily_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "know_3",
    category_id: "leis",
    question_text:
      "A Lei da Ficha Limpa (LC 135/2010) impede a candidatura de políticos condenados por quanto tempo?",
    question_type: "multiple_choice",
    options: [
      { id: "a", text: "4 anos" },
      { id: "b", text: "8 anos" },
      { id: "c", text: "10 anos" },
      { id: "d", text: "Permanente" },
    ],
    correct_answer: "b",
    explanation:
      "A Lei da Ficha Limpa torna inelegível por 8 anos o candidato condenado por órgão colegiado.",
    source_url: null,
    difficulty: 2,
    dimension_impacts: null,
    is_active: true,
    is_daily: false,
    daily_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "know_4",
    category_id: "atualidades",
    question_text: "Qual é o número mínimo de deputados necessários para aprovar uma PEC na Câmara?",
    question_type: "multiple_choice",
    options: [
      { id: "a", text: "257 deputados" },
      { id: "b", text: "308 deputados" },
      { id: "c", text: "342 deputados" },
      { id: "d", text: "400 deputados" },
    ],
    correct_answer: "b",
    explanation: "PECs precisam de 3/5 dos votos (308 de 513) em dois turnos para serem aprovadas.",
    source_url: null,
    difficulty: 3,
    dimension_impacts: null,
    is_active: true,
    is_daily: false,
    daily_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "know_5",
    category_id: "historia",
    question_text: "Quantos presidentes o Brasil já teve desde a redemocratização em 1985?",
    question_type: "multiple_choice",
    options: [
      { id: "a", text: "7 presidentes" },
      { id: "b", text: "8 presidentes" },
      { id: "c", text: "9 presidentes" },
      { id: "d", text: "10 presidentes" },
    ],
    correct_answer: "c",
    explanation:
      "Desde 1985: Sarney, Collor, Itamar, FHC, Lula, Dilma, Temer, Bolsonaro e Lula novamente (9 presidentes até 2024).",
    source_url: null,
    difficulty: 2,
    dimension_impacts: null,
    is_active: true,
    is_daily: false,
    daily_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

type QuizType = "valores" | "conhecimento" | "diario";

const QUIZ_TYPES = [
  {
    id: "valores" as QuizType,
    title: "Descubra seus Valores",
    description: "Responda perguntas e descubra seu perfil político",
    icon: Compass,
    color: "bg-purple-500",
    questions: LOCAL_VALUES_QUESTIONS,
  },
  {
    id: "conhecimento" as QuizType,
    title: "Quiz de Conhecimento",
    description: "Teste seus conhecimentos sobre política brasileira",
    icon: Brain,
    color: "bg-blue-500",
    questions: LOCAL_KNOWLEDGE_QUESTIONS,
  },
  {
    id: "diario" as QuizType,
    title: "Quiz Diário",
    description: "Desafio do dia - volte amanhã para mais!",
    icon: Flame,
    color: "bg-orange-500",
    questions: [], // Será carregado do banco
    locked: true,
  },
];

export default function QuizPage() {
  const [selectedType, setSelectedType] = useState<QuizType | null>(null);
  const [politicalValues, setPoliticalValues] = useState<UserPoliticalValue[] | null>(null);
  const [knowledgeScore, setKnowledgeScore] = useState<{
    correct: number;
    total: number;
    percentage: number;
  } | null>(null);

  const activeQuizType = QUIZ_TYPES.find((t) => t.id === selectedType);
  const questions = activeQuizType?.questions || [];

  const quiz = useQuiz(questions);

  // Carregar valores salvos
  useEffect(() => {
    const saved = localStorage.getItem("political-values");
    if (saved) {
      try {
        setPoliticalValues(JSON.parse(saved));
      } catch {
        // Ignora
      }
    }
  }, []);

  const handleQuizComplete = () => {
    if (selectedType === "valores") {
      const values = quiz.calculatePoliticalValues();
      setPoliticalValues(values);
      localStorage.setItem("political-values", JSON.stringify(values));
    } else if (selectedType === "conhecimento") {
      const score = quiz.calculateKnowledgeScore();
      setKnowledgeScore(score);
    }
  };

  // Detecta quando o quiz é completado
  useEffect(() => {
    if (quiz.isComplete) {
      handleQuizComplete();
    }
  }, [quiz.isComplete]);

  const handleReset = () => {
    quiz.reset();
    if (selectedType === "valores") {
      setPoliticalValues(null);
      localStorage.removeItem("political-values");
    } else {
      setKnowledgeScore(null);
    }
  };

  const handleBack = () => {
    setSelectedType(null);
    quiz.reset();
    setKnowledgeScore(null);
  };

  // Tela de seleção de quiz
  if (!selectedType) {
    return (
      <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black uppercase mb-2 dark:text-brutal-dark-text">
            Quiz Político
          </h1>
          <p className="text-gray-600 dark:text-brutal-dark-muted">
            Descubra seu perfil político e teste seus conhecimentos
          </p>
        </div>

        {/* Valores já calculados */}
        {politicalValues && politicalValues.length > 0 && (
          <div className="card-brutal bg-white dark:bg-brutal-dark-surface p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black uppercase dark:text-brutal-dark-text">
                Seu Perfil Político
              </h2>
              <button
                onClick={() => {
                  setPoliticalValues(null);
                  localStorage.removeItem("political-values");
                }}
                className="text-sm text-gray-500 hover:text-black dark:hover:text-white flex items-center gap-1"
              >
                <RotateCcw size={14} />
                Refazer
              </button>
            </div>
            <PoliticalValuesResult values={politicalValues} />
            <div className="mt-4 pt-4 border-t-2 border-black dark:border-brutal-dark-border">
              <Link
                href="/quiz/matching"
                className="btn-brutal bg-brutal-yellow dark:bg-brutal-dark-accent text-black dark:text-white inline-flex items-center gap-2"
              >
                Ver deputados alinhados
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}

        {/* Tipos de quiz */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {QUIZ_TYPES.map((type) => {
            const Icon = type.icon;
            const isLocked = type.locked;
            const hasCompleted = type.id === "valores" && politicalValues && politicalValues.length > 0;

            return (
              <button
                key={type.id}
                onClick={() => !isLocked && setSelectedType(type.id)}
                disabled={isLocked}
                className={`card-brutal p-6 text-left transition-all ${
                  isLocked
                    ? "bg-gray-100 dark:bg-brutal-dark-bg opacity-60 cursor-not-allowed"
                    : "bg-white dark:bg-brutal-dark-surface hover:translate-x-1 hover:-translate-y-1"
                }`}
              >
                <div
                  className={`w-12 h-12 ${type.color} flex items-center justify-center mb-4 border-2 border-black`}
                >
                  {isLocked ? (
                    <Lock size={24} className="text-white" />
                  ) : (
                    <Icon size={24} className="text-white" />
                  )}
                </div>
                <h3 className="font-black text-lg mb-1 dark:text-brutal-dark-text flex items-center gap-2">
                  {type.title}
                  {hasCompleted && <CheckCircle size={18} className="text-green-500" />}
                </h3>
                <p className="text-sm text-gray-600 dark:text-brutal-dark-muted">{type.description}</p>
                {isLocked && (
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 font-bold">
                    Em breve - Configure o Supabase
                  </p>
                )}
                {!isLocked && (
                  <p className="text-xs text-gray-400 mt-2">{type.questions.length} perguntas</p>
                )}
              </button>
            );
          })}
        </div>

        {/* Categorias do quiz de conhecimento */}
        <div className="mt-8">
          <h2 className="text-xl font-black uppercase mb-4 dark:text-brutal-dark-text">Categorias</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "leis", label: "Projetos de Lei", icon: ScrollText, color: "bg-blue-100 text-blue-800" },
              { id: "escandalos", label: "Escândalos", icon: AlertTriangle, color: "bg-red-100 text-red-800" },
              { id: "votacoes", label: "Votações", icon: CheckCircle, color: "bg-green-100 text-green-800" },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <span
                  key={cat.id}
                  className={`px-3 py-1.5 text-sm font-bold flex items-center gap-1.5 border-2 border-black ${cat.color}`}
                >
                  <Icon size={14} />
                  {cat.label}
                </span>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  // Tela de resultado
  if (quiz.isComplete) {
    return (
      <main className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto">
        <div className="card-brutal bg-white dark:bg-brutal-dark-surface p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-brutal-yellow dark:bg-brutal-dark-accent border-3 border-black dark:border-brutal-dark-accent flex items-center justify-center mb-4">
              <Trophy size={40} className="text-black dark:text-white" />
            </div>
            <h1 className="text-3xl font-black uppercase dark:text-brutal-dark-text">
              {selectedType === "valores" ? "Perfil Calculado!" : "Quiz Concluído!"}
            </h1>
          </div>

          {/* Resultado do quiz de valores */}
          {selectedType === "valores" && politicalValues && (
            <div className="mb-6">
              <h2 className="text-lg font-black mb-4 dark:text-brutal-dark-text">
                Seus Valores Políticos
              </h2>
              <PoliticalValuesResult values={politicalValues} />
            </div>
          )}

          {/* Resultado do quiz de conhecimento */}
          {selectedType === "conhecimento" && knowledgeScore && (
            <div className="mb-6 text-center">
              <div className="text-6xl font-black text-brutal-yellow dark:text-brutal-dark-accent mb-2">
                {knowledgeScore.percentage}%
              </div>
              <p className="text-gray-600 dark:text-brutal-dark-muted">
                Você acertou {knowledgeScore.correct} de {knowledgeScore.total} perguntas
              </p>
            </div>
          )}

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleReset} className="btn-brutal bg-gray-200 dark:bg-brutal-dark-bg flex-1">
              <RotateCcw size={18} className="inline mr-2" />
              Refazer Quiz
            </button>
            <button
              onClick={() => {
                // TODO: Implementar compartilhamento
                alert("Compartilhamento em breve!");
              }}
              className="btn-brutal bg-black dark:bg-brutal-dark-accent text-white flex-1"
            >
              <Share2 size={18} className="inline mr-2" />
              Compartilhar
            </button>
          </div>

          {selectedType === "valores" && (
            <Link
              href="/quiz/matching"
              className="btn-brutal bg-brutal-yellow dark:bg-brutal-dark-accent text-black dark:text-white w-full mt-4 flex items-center justify-center gap-2"
            >
              Ver deputados alinhados
              <ArrowRight size={18} />
            </Link>
          )}

          <button
            onClick={handleBack}
            className="w-full mt-4 text-sm text-gray-500 hover:text-black dark:hover:text-white"
          >
            Voltar ao menu
          </button>
        </div>
      </main>
    );
  }

  // Tela do quiz em andamento
  return (
    <main className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto">
      <div className="mb-4">
        <button
          onClick={handleBack}
          className="text-sm text-gray-500 hover:text-black dark:hover:text-white mb-2"
        >
          &larr; Voltar
        </button>
        <h1 className="text-2xl font-black uppercase dark:text-brutal-dark-text">
          {activeQuizType?.title}
        </h1>
      </div>

      <QuizProgress
        current={quiz.currentQuestionIndex + 1}
        total={quiz.totalQuestions}
        progress={quiz.progress}
      />

      {quiz.currentQuestion && (
        <QuizCard
          question={quiz.currentQuestion}
          onAnswer={quiz.submitAnswer}
          showExplanation={selectedType === "conhecimento"}
        />
      )}
    </main>
  );
}
