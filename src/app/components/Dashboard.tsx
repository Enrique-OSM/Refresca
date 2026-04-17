import { motion } from "motion/react";
import { KPICard } from "./KPICard";
import { ActivityFeed } from "./ActivityFeed";
import { LossChart } from "./LossChart";
import { TrendingDown, DollarSign, Zap, Heart } from "lucide-react";

export function Dashboard() {
  const kpiData = [
    {
      title: "Food Saved",
      value: "1,247",
      unit: "kg",
      change: "+12.3%",
      trend: "up",
      icon: TrendingDown,
      color: "fresh" as const,
    },
    {
      title: "Economic Loss Prevented",
      value: "$8,940",
      unit: "",
      change: "+8.7%",
      trend: "up",
      icon: DollarSign,
      color: "donate" as const,
    },
    {
      title: "Active Flash Sales",
      value: "23",
      unit: "items",
      change: "+5",
      trend: "up",
      icon: Zap,
      color: "flash" as const,
    },
    {
      title: "Pending Donations",
      value: "12",
      unit: "batches",
      change: "-2",
      trend: "down",
      icon: Heart,
      color: "internal" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <KPICard {...kpi} />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Loss Prediction Chart - Takes 2 columns */}
        <motion.div
          className="xl:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <LossChart />
        </motion.div>

        {/* Activity Feed - Takes 1 column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <ActivityFeed />
        </motion.div>
      </div>
    </div>
  );
}
