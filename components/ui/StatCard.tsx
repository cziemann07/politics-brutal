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
    default: "bg-white text-black border-black",
    red: "bg-brutal-red text-white border-black",
    yellow: "bg-brutal-yellow text-black border-black",
  };

  const bgClass = variants[variant];

  return (
    <div className={`${bgClass} border-3 shadow-hard p-6 relative`}>
      {badge && (
        <div className="absolute -top-3 -right-3 bg-brutal-red text-white text-xs font-black px-3 py-1 border-2 border-black rotate-3">
          {badge}
        </div>
      )}
      <Icon className="w-10 h-10 mb-4" />
      {label && <p className="text-label mb-1 opacity-90">{label}</p>}
      <p className="text-4xl font-black mb-2">{value}</p>
      <p className="text-small">{description}</p>
    </div>
  );
}
