"use client";

import React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import type { VoteType } from "@/hooks/useVotes";

interface VoteButtonsProps {
  upvotes: number;
  downvotes: number;
  userVote: VoteType;
  onVote: (type: "up" | "down") => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function VoteButtons({
  upvotes,
  downvotes,
  userVote,
  onVote,
  disabled = false,
  size = "md",
}: VoteButtonsProps) {
  const sizeConfig = {
    sm: { icon: 14, text: "text-xs", padding: "px-2 py-1", gap: "gap-1" },
    md: { icon: 16, text: "text-sm", padding: "px-3 py-1.5", gap: "gap-1.5" },
    lg: { icon: 20, text: "text-base", padding: "px-4 py-2", gap: "gap-2" },
  };

  const config = sizeConfig[size];
  const score = upvotes - downvotes;

  return (
    <div className="flex items-center gap-1">
      {/* Upvote */}
      <button
        onClick={() => onVote("up")}
        disabled={disabled}
        className={`
          flex items-center ${config.gap} ${config.padding} ${config.text}
          font-bold border-2 transition-all active:scale-95
          ${
            userVote === "up"
              ? "bg-green-500 text-white border-green-600 dark:bg-green-600"
              : "bg-white dark:bg-brutal-dark-surface text-gray-700 dark:text-brutal-dark-text border-gray-300 dark:border-brutal-dark-border hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-400"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          rounded-l
        `}
        title="Concordo / Relevante"
      >
        <ThumbsUp
          size={config.icon}
          className={userVote === "up" ? "fill-current" : ""}
        />
        <span>{upvotes}</span>
      </button>

      {/* Score */}
      <div
        className={`
          ${config.padding} ${config.text} font-black
          border-y-2 border-gray-300 dark:border-brutal-dark-border
          ${
            score > 0
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
              : score < 0
                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                : "bg-gray-100 dark:bg-brutal-dark-bg text-gray-500 dark:text-brutal-dark-muted"
          }
        `}
      >
        {score > 0 ? `+${score}` : score}
      </div>

      {/* Downvote */}
      <button
        onClick={() => onVote("down")}
        disabled={disabled}
        className={`
          flex items-center ${config.gap} ${config.padding} ${config.text}
          font-bold border-2 transition-all active:scale-95
          ${
            userVote === "down"
              ? "bg-red-500 text-white border-red-600 dark:bg-red-600"
              : "bg-white dark:bg-brutal-dark-surface text-gray-700 dark:text-brutal-dark-text border-gray-300 dark:border-brutal-dark-border hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-400"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          rounded-r
        `}
        title="Discordo / Irrelevante"
      >
        <ThumbsDown
          size={config.icon}
          className={userVote === "down" ? "fill-current" : ""}
        />
        <span>{downvotes}</span>
      </button>
    </div>
  );
}
