import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { dashboardAPI } from "../../utils/api";

interface ChartData {
  date: string;
  waste: number;
  saved: number;
  target: number;
}

export function LossChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await dashboardAPI.getLossChartData();
      if (response.success && response.data) {
        setData(response.data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-5 h-5 text-[var(--fresh-green)]" />
            <h2 className="text-lg">Waste Reduction Trends</h2>
          </div>
          <p className="text-sm text-gray-500">7-day performance overview</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--fresh-green)]" />
            <span className="text-sm text-gray-600">Food Saved (kg)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--expired-red)]" />
            <span className="text-sm text-gray-600">Waste (kg)</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                key="x-axis"
                dataKey="date"
                stroke="#6B7280"
                style={{ fontSize: "12px", fontFamily: "var(--font-mono)" }}
              />
              <YAxis
                key="y-axis"
                stroke="#6B7280"
                style={{ fontSize: "12px", fontFamily: "var(--font-mono)" }}
              />
              <Tooltip
                key="tooltip"
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line
                key="line-saved"
                type="monotone"
                dataKey="saved"
                name="Food Saved"
                stroke="var(--fresh-green)"
                strokeWidth={3}
                dot={{ fill: "var(--fresh-green)", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                key="line-waste"
                type="monotone"
                dataKey="waste"
                name="Waste"
                stroke="var(--expired-red)"
                strokeWidth={3}
                dot={{ fill: "var(--expired-red)", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                key="line-target"
                type="monotone"
                dataKey="target"
                name="Target"
                stroke="#D1D5DB"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {!loading && (
        <div className="mt-4 p-4 bg-[var(--fresh-green-light)] rounded-lg border border-[var(--fresh-green)]">
          <p className="text-sm text-[var(--fresh-green-dark)]">
            <span className="font-bold">Dashboard Synced</span> - Tracking daily movements
          </p>
        </div>
      )}
    </div>
  );
}
