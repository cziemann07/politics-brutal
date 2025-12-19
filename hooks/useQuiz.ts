"use client";

import { useState, useCallback } from "react";
import type {
  QuizQuestion,
  AgreeDisagreeAnswer,
  DimensionImpact,
  UserPoliticalValue,
} from "@/types/database";

// Valores numéricos para cada resposta agree/disagree
const AGREE_DISAGREE_VALUES: Record<AgreeDisagreeAnswer, number> = {
  strongly_disagree: 0,
  disagree: 25,
  neutral: 50,
  agree: 75,
  strongly_agree: 100,
};

type QuizState = {
  currentQuestionIndex: number;
  answers: Map<string, { answer: unknown; timestamp: number }>;
  isComplete: boolean;
  startTime: number;
};

type PoliticalValues = Map<string, { total: number; count: number }>;

export function useQuiz(questions: QuizQuestion[]) {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: new Map(),
    isComplete: false,
    startTime: Date.now(),
  });

  const currentQuestion = questions[state.currentQuestionIndex] || null;
  const progress = questions.length > 0 ? ((state.currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const submitAnswer = useCallback(
    (answer: unknown) => {
      if (!currentQuestion) return;

      setState((prev) => {
        const newAnswers = new Map(prev.answers);
        newAnswers.set(currentQuestion.id, {
          answer,
          timestamp: Date.now(),
        });

        const isLastQuestion = prev.currentQuestionIndex >= questions.length - 1;

        return {
          ...prev,
          answers: newAnswers,
          currentQuestionIndex: isLastQuestion ? prev.currentQuestionIndex : prev.currentQuestionIndex + 1,
          isComplete: isLastQuestion,
        };
      });
    },
    [currentQuestion, questions.length]
  );

  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < questions.length) {
        setState((prev) => ({
          ...prev,
          currentQuestionIndex: index,
          isComplete: false,
        }));
      }
    },
    [questions.length]
  );

  const reset = useCallback(() => {
    setState({
      currentQuestionIndex: 0,
      answers: new Map(),
      isComplete: false,
      startTime: Date.now(),
    });
  }, []);

  // Calcula valores políticos baseado nas respostas
  const calculatePoliticalValues = useCallback((): UserPoliticalValue[] => {
    const values: PoliticalValues = new Map();

    for (const question of questions) {
      const answerData = state.answers.get(question.id);
      if (!answerData) continue;

      const impacts = question.dimension_impacts as DimensionImpact[] | null;
      if (!impacts) continue;

      const answer = answerData.answer as AgreeDisagreeAnswer;
      const answerValue = AGREE_DISAGREE_VALUES[answer] ?? 50;

      for (const impact of impacts) {
        // Se left_weight = 1 e right_weight = 0:
        // - strongly_agree (100) = 100 (mais à esquerda)
        // - strongly_disagree (0) = 0 (mais à direita)
        // Invertemos para que score alto = mais à direita
        const adjustedValue =
          impact.left_weight > impact.right_weight
            ? 100 - answerValue // Inverte para perguntas "left-leaning"
            : answerValue;

        const current = values.get(impact.dimension_id) || { total: 0, count: 0 };
        values.set(impact.dimension_id, {
          total: current.total + adjustedValue,
          count: current.count + 1,
        });
      }
    }

    // Converte para array de valores
    const result: UserPoliticalValue[] = [];
    values.forEach((data, dimensionId) => {
      result.push({
        id: `temp_${dimensionId}`,
        user_id: "",
        dimension_id: dimensionId,
        score: Math.round(data.total / data.count),
        confidence: Math.min(1, data.count / 5), // Confiança aumenta com mais respostas
        is_manual: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    });

    return result;
  }, [questions, state.answers]);

  // Calcula pontuação para quiz de conhecimento
  const calculateKnowledgeScore = useCallback(() => {
    let correct = 0;
    let total = 0;

    for (const question of questions) {
      if (!question.correct_answer) continue;
      total++;

      const answerData = state.answers.get(question.id);
      if (answerData?.answer === question.correct_answer) {
        correct++;
      }
    }

    return {
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  }, [questions, state.answers]);

  return {
    // Estado
    currentQuestion,
    currentQuestionIndex: state.currentQuestionIndex,
    totalQuestions: questions.length,
    progress,
    isComplete: state.isComplete,
    answers: state.answers,

    // Ações
    submitAnswer,
    goToQuestion,
    reset,

    // Cálculos
    calculatePoliticalValues,
    calculateKnowledgeScore,
  };
}
