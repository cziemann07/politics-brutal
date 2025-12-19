"use client";

type QuizProgressProps = {
  current: number;
  total: number;
  progress: number;
};

export function QuizProgress({ current, total, progress }: QuizProgressProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-gray-600 dark:text-brutal-dark-muted">
          Pergunta {current} de {total}
        </span>
        <span className="text-sm font-bold text-gray-600 dark:text-brutal-dark-muted">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full h-4 bg-gray-200 dark:bg-brutal-dark-bg border-2 border-black dark:border-brutal-dark-border">
        <div
          className="h-full bg-black dark:bg-brutal-dark-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
