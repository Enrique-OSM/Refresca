interface FreshnessGaugeProps {
  daysLeft: number;
}

export function FreshnessGauge({ daysLeft }: FreshnessGaugeProps) {
  const getGaugeConfig = () => {
    if (daysLeft < 0) {
      return {
        percentage: 0,
        color: "bg-[var(--expired-red)]",
        textColor: "text-[var(--expired-red)]",
        label: "Expired",
      };
    } else if (daysLeft <= 2) {
      return {
        percentage: 20,
        color: "bg-[var(--flash-orange)]",
        textColor: "text-[var(--flash-orange)]",
        label: `${daysLeft}d left`,
      };
    } else if (daysLeft <= 5) {
      return {
        percentage: 50,
        color: "bg-[var(--internal-yellow)]",
        textColor: "text-yellow-700",
        label: `${daysLeft}d left`,
      };
    } else {
      return {
        percentage: 100,
        color: "bg-[var(--fresh-green)]",
        textColor: "text-[var(--fresh-green-dark)]",
        label: `${daysLeft}d left`,
      };
    }
  };

  const config = getGaugeConfig();

  return (
    <div className="flex items-center gap-3">
      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${config.color} transition-all duration-300`}
          style={{ width: `${config.percentage}%` }}
        />
      </div>
      <span
        className={`text-xs font-mono whitespace-nowrap ${config.textColor}`}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {config.label}
      </span>
    </div>
  );
}
