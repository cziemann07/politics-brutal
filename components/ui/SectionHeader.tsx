import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  linkHref?: string;
  linkText?: string;
  centered?: boolean;
}

export default function SectionHeader({
  title,
  subtitle,
  linkHref,
  linkText = "Ver Todos",
  centered = false,
}: SectionHeaderProps) {
  return (
    <div
      className={`flex flex-col ${centered ? "items-center text-center" : "md:flex-row md:items-center md:justify-between"} mb-brutal-md gap-4`}
    >
      <div className={centered ? "max-w-3xl" : ""}>
        <h2 className="heading-section">{title}</h2>
        {subtitle && <p className="text-body text-gray-600 mt-2">{subtitle}</p>}
      </div>
      {linkHref && (
        <Link href={linkHref} className="btn-brutal text-sm shrink-0">
          {linkText}
        </Link>
      )}
    </div>
  );
}
