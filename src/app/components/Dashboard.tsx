import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { KPICard } from "./KPICard";
import { ActivityFeed } from "./ActivityFeed";
import { LossChart } from "./LossChart";
import { TrendingDown, DollarSign, Zap, Heart, Loader2 } from "lucide-react";
import { dashboardAPI, DashboardKPIs } from "../../utils/api";

export function Dashboard() {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      const response = await dashboardAPI.getKPIs();
      if (response.success && response.data) {
        setKpis(response.data);
      }
      setLoading(false);
    };
    fetchKPIs();
  }, []);

  const kpiData = [
    {
      title: "Food Saved",
      value: kpis ? kpis.foodSavedKg.toLocaleString(undefined, { maximumFractionDigits: 1 }) : "0",
      unit: "kg",
      change: "+12.3%",
      trend: "up" as const,
      icon: TrendingDown,
      color: "fresh" as const,
    },
    {
      title: "Economic Loss Prevented",
      value: kpis ? `$${kpis.economicLossPrevented.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00",
      unit: "",
      change: "+8.7%",
      trend: "up" as const,
      icon: DollarSign,
      color: "donate" as const,
    },
    {
      title: "Active Flash Sales",
      value: kpis ? kpis.activeFlashSales.toString() : "0",
      unit: "items",
      change: "+5",
      trend: "up" as const,
      icon: Zap,
      color: "flash" as const,
    },
    {
      title: "Pending Donations",
      value: kpis ? kpis.pendingDonations.toString() : "0",
      unit: "batches",
      change: "-2",
      trend: "down" as const,
      icon: Heart,
      color: "internal" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
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
      )}

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
