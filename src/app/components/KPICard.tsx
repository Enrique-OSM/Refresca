import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

type ColorScheme = "fresh" | "flash" | "internal" | "donate" | "expired";

interface KPICardProps {
  title: string;
  value: string;
  unit: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  color: ColorScheme;
}

const colorClasses = {
  fresh: {
    bg: "bg-[var(--fresh-green-light)]",
    text: "text-[var(--fresh-green-dark)]",
    icon: "text-[var(--fresh-green)]",
    border: "border-[var(--fresh-green)]",
  },
  flash: {
    bg: "bg-[var(--flash-orange-light)]",
    text: "text-orange-900",
    icon: "text-[var(--flash-orange)]",
    border: "border-[var(--flash-orange)]",
  },
  internal: {
    bg: "bg-[var(--internal-yellow-light)]",
    text: "text-yellow-900",
    icon: "text-[var(--internal-yellow)]",
    border: "border-[var(--internal-yellow)]",
  },
  donate: {
    bg: "bg-[var(--donate-blue-light)]",
    text: "text-blue-900",
    icon: "text-[var(--donate-blue)]",
    border: "border-[var(--donate-blue)]",
  },
  expired: {
    bg: "bg-[var(--expired-red-light)]",
    text: "text-red-900",
    icon: "text-[var(--expired-red)]",
    border: "border-[var(--expired-red)]",
  },
};

export function KPICard({
  title,
  value,
  unit,
  change,
  trend,
  icon: Icon,
  color,
}: KPICardProps) {
  const colors = colorClasses[color];

  return (
    <motion.div
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 relative overflow-hidden group hover:shadow-md transition-shadow duration-300"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Decorative accent bar */}
      <div className={`absolute top-0 left-0 h-1 w-full ${colors.bg}`} />

      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colors.bg}`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        <div
          className={`px-2.5 py-1 rounded-full text-xs font-mono ${
            trend === "up" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-700"
          }`}
        >
          {change}
        </div>
      </div>

      <h3 className="text-sm text-gray-600 mb-1 font-medium">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span
          className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-sm text-gray-500 font-medium">{unit}</span>
        )}
      </div>
    </motion.div>
  );
}
