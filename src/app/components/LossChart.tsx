import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown } from "lucide-react";

const mockData = [
  { date: "Apr 7", waste: 45, saved: 82, target: 60 },
  { date: "Apr 8", waste: 38, saved: 95, target: 60 },
  { date: "Apr 9", waste: 42, saved: 88, target: 60 },
  { date: "Apr 10", waste: 35, saved: 102, target: 60 },
  { date: "Apr 11", waste: 28, saved: 115, target: 60 },
  { date: "Apr 12", waste: 22, saved: 128, target: 60 },
  { date: "Apr 13", waste: 18, saved: 142, target: 60 },
  { date: "Apr 14", waste: 15, saved: 156, target: 60 },
];

export function LossChart() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={mockData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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

      <div className="mt-4 p-4 bg-[var(--fresh-green-light)] rounded-lg border border-[var(--fresh-green)]">
        <p className="text-sm text-[var(--fresh-green-dark)]">
          <span className="font-bold">↓ 67% waste reduction</span> this week compared to
          previous period. Keep up the excellent work!
        </p>
      </div>
    </div>
  );
}
