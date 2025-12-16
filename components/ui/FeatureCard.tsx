import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  href: string;
  icon: LucideIcon;
  iconColor: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
}

export default function FeatureCard({
  href,
  icon: Icon,
  iconColor,
  title,
  subtitle,
  description,
  ctaText,
}: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="card-brutal hover:shadow-hard-hover transition-all group bg-white p-8"
    >
      <div className="flex items-start gap-4 mb-4">
        <Icon className={`w-12 h-12 ${iconColor} group-hover:scale-110 transition-transform shrink-0`} />
        <div>
          <h3 className="heading-card mb-1">{title}</h3>
          <p className="text-small text-gray-600">{subtitle}</p>
        </div>
      </div>
      <p className="text-body mb-4 text-gray-700">{description}</p>
      <div className={`flex items-center gap-2 text-small font-bold ${iconColor}`}>
        {ctaText}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
