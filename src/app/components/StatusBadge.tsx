type Status = "fresh" | "flash" | "internal" | "donate" | "expired";

interface StatusBadgeProps {
  status: Status;
  size?: "sm" | "md";
}

const statusConfig = {
  fresh: {
    label: "Fresh",
    bg: "bg-[var(--fresh-green-light)]",
    text: "text-[var(--fresh-green-dark)]",
    border: "border-[var(--fresh-green)]",
  },
  flash: {
    label: "Flash Sale",
    bg: "bg-[var(--flash-orange-light)]",
    text: "text-orange-900",
    border: "border-[var(--flash-orange)]",
  },
  internal: {
    label: "Internal Offer",
    bg: "bg-[var(--internal-yellow-light)]",
    text: "text-yellow-900",
    border: "border-[var(--internal-yellow)]",
  },
  donate: {
    label: "Donate",
    bg: "bg-[var(--donate-blue-light)]",
    text: "text-blue-900",
    border: "border-[var(--donate-blue)]",
  },
  expired: {
    label: "Expired/Waste",
    bg: "bg-[var(--expired-red-light)]",
    text: "text-red-900",
    border: "border-[var(--expired-red)]",
  },
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {config.label}
    </span>
  );
}
