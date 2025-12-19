"use client";

import { useState } from "react";
import type { QuizQuestion, AgreeDisagreeAnswer, QuizOption } from "@/types/database";
import { ChevronRight, HelpCircle, CheckCircle, XCircle } from "lucide-react";

type QuizCardProps = {
  question: QuizQuestion;
  onAnswer: (answer: unknown) => void;
  showExplanation?: boolean;
  previousAnswer?: unknown;
};

const AGREE_DISAGREE_OPTIONS: { value: AgreeDisagreeAnswer; label: string; emoji: string }[] = [
  { value: "strongly_disagree", label: "Discordo totalmente", emoji: "1" },
  { value: "disagree", label: "Discordo", emoji: "2" },
  { value: "neutral", label: "Neutro", emoji: "3" },
  { value: "agree", label: "Concordo", emoji: "4" },
  { value: "strongly_agree", label: "Concordo totalmente", emoji: "5" },
];

export function QuizCard({ question, onAnswer, showExplanation = false, previousAnswer }: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<unknown>(previousAnswer || null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (answer: unknown) => {
    setSelectedAnswer(answer);

    // Para perguntas de conhecimento, mostra resultado antes de avançar
    if (question.correct_answer && showExplanation) {
      setShowResult(true);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      onAnswer(selectedAnswer);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const isCorrect = question.correct_answer && selectedAnswer === question.correct_answer;

  return (
    <div className="card-brutal bg-white dark:bg-brutal-dark-surface p-6 md:p-8">
      {/* Categoria */}
      {question.category_id && (
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-brutal-dark-muted mb-2 block">
          {question.category_id}
        </span>
      )}

      {/* Pergunta */}
      <h2 className="text-xl md:text-2xl font-black mb-6 dark:text-brutal-dark-text leading-tight">
        {question.question_text}
      </h2>

      {/* Opções de resposta */}
      <div className="space-y-3">
        {question.question_type === "agree_disagree" && (
          <div className="space-y-2">
            {AGREE_DISAGREE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full p-4 text-left border-3 transition-all font-bold ${
                  selectedAnswer === option.value
                    ? "bg-black dark:bg-brutal-dark-accent text-white border-black dark:border-brutal-dark-accent"
                    : "bg-white dark:bg-brutal-dark-bg text-black dark:text-brutal-dark-text border-black dark:border-brutal-dark-border hover:bg-gray-100 dark:hover:bg-brutal-dark-surface"
                }`}
              >
                <span className="inline-flex items-center justify-center w-8 h-8 mr-3 border-2 border-current text-sm">
                  {option.emoji}
                </span>
                {option.label}
              </button>
            ))}
          </div>
        )}

        {question.question_type === "multiple_choice" && question.options && (
          <div className="space-y-2">
            {(question.options as QuizOption[]).map((option) => {
              const isSelected = selectedAnswer === option.id;
              const isOptionCorrect = option.id === question.correct_answer;
              const showOptionResult = showResult && (isSelected || isOptionCorrect);

              return (
                <button
                  key={option.id}
                  onClick={() => !showResult && handleSelect(option.id)}
                  disabled={showResult}
                  className={`w-full p-4 text-left border-3 transition-all font-bold flex items-center gap-3 ${
                    showOptionResult
                      ? isOptionCorrect
                        ? "bg-green-500 text-white border-green-600"
                        : isSelected
                          ? "bg-red-500 text-white border-red-600"
                          : "bg-white dark:bg-brutal-dark-bg text-black dark:text-brutal-dark-text border-black dark:border-brutal-dark-border"
                      : isSelected
                        ? "bg-black dark:bg-brutal-dark-accent text-white border-black dark:border-brutal-dark-accent"
                        : "bg-white dark:bg-brutal-dark-bg text-black dark:text-brutal-dark-text border-black dark:border-brutal-dark-border hover:bg-gray-100 dark:hover:bg-brutal-dark-surface"
                  }`}
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 border-2 border-current text-sm flex-shrink-0">
                    {option.id.toUpperCase()}
                  </span>
                  <span className="flex-1">{option.text}</span>
                  {showOptionResult && isOptionCorrect && <CheckCircle size={20} />}
                  {showOptionResult && isSelected && !isOptionCorrect && <XCircle size={20} />}
                </button>
              );
            })}
          </div>
        )}

        {question.question_type === "scale" && (
          <div className="py-4">
            <input
              type="range"
              min="0"
              max="100"
              value={(selectedAnswer as number) || 50}
              onChange={(e) => setSelectedAnswer(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 dark:bg-brutal-dark-bg rounded-none appearance-none cursor-pointer accent-black dark:accent-brutal-dark-accent"
            />
            <div className="flex justify-between mt-2 text-sm font-bold text-gray-600 dark:text-brutal-dark-muted">
              <span>0</span>
              <span className="text-lg dark:text-brutal-dark-text">{(selectedAnswer as number) || 50}</span>
              <span>100</span>
            </div>
          </div>
        )}
      </div>

      {/* Explicação (após responder pergunta de conhecimento) */}
      {showResult && question.explanation && (
        <div
          className={`mt-6 p-4 border-3 ${
            isCorrect
              ? "bg-green-100 dark:bg-green-900/30 border-green-500"
              : "bg-red-100 dark:bg-red-900/30 border-red-500"
          }`}
        >
          <div className="flex items-start gap-3">
            <HelpCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">{isCorrect ? "Correto!" : "Incorreto"}</p>
              <p className="text-sm">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Botão de avançar */}
      <button
        onClick={handleSubmit}
        disabled={selectedAnswer === null}
        className={`w-full mt-6 btn-brutal flex items-center justify-center gap-2 ${
          selectedAnswer === null
            ? "bg-gray-200 dark:bg-brutal-dark-bg text-gray-400 cursor-not-allowed"
            : "bg-brutal-yellow dark:bg-brutal-dark-accent text-black dark:text-white"
        }`}
      >
        {showResult ? "Próxima pergunta" : "Responder"}
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
