import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label?: string;
  value: string;
  description: string;
  variant?: "default" | "red" | "yellow";
  badge?: string;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  description,
  variant = "default",
  badge,
}: StatCardProps) {
  const variants = {
    default: "bg-white dark:bg-brutal-dark-surface text-black dark:text-brutal-dark-text border-black dark:border-brutal-dark-border",
    red: "bg-brutal-red text-white border-black dark:border-brutal-red",
    yellow: "bg-brutal-yellow dark:bg-brutal-dark-accent text-black dark:text-white border-black dark:border-brutal-dark-accent",
  };

  const bgClass = variants[variant];

  return (
    <div className={`${bgClass} border-3 shadow-hard dark:shadow-none p-6 relative`}>
      {badge && (
        <div className="absolute -top-3 -right-3 bg-brutal-red text-white text-xs font-black px-3 py-1 border-2 border-black rotate-3">
          {badge}
        </div>
      )}
      <Icon className="w-10 h-10 mb-4" />
      {label && <p className="text-label mb-1 opacity-90">{label}</p>}
      <p className="text-4xl font-black mb-2">{value}</p>
      <p className="text-small opacity-90">{description}</p>
    </div>
  );
}
