import { motion } from "motion/react";
import { Clock, ArrowRight } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface Activity {
  id: string;
  batchId: string;
  action: string;
  status: "fresh" | "flash" | "internal" | "donate" | "expired";
  timestamp: string;
  reason: string;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    batchId: "BTH-102",
    action: "Moved to Flash Sale",
    status: "flash",
    timestamp: "2 min ago",
    reason: "3-day expiry threshold",
  },
  {
    id: "2",
    batchId: "BTH-089",
    action: "Donated to Food Bank",
    status: "donate",
    timestamp: "15 min ago",
    reason: "1-day expiry, low demand",
  },
  {
    id: "3",
    batchId: "BTH-156",
    action: "Internal Offer Activated",
    status: "internal",
    timestamp: "32 min ago",
    reason: "Moderate sales pace",
  },
  {
    id: "4",
    batchId: "BTH-134",
    action: "Flash Sale Success",
    status: "fresh",
    timestamp: "1 hour ago",
    reason: "All units sold",
  },
  {
    id: "5",
    batchId: "BTH-078",
    action: "Marked as Expired",
    status: "expired",
    timestamp: "2 hours ago",
    reason: "Past expiry date",
  },
  {
    id: "6",
    batchId: "BTH-145",
    action: "Moved to Flash Sale",
    status: "flash",
    timestamp: "3 hours ago",
    reason: "2-day expiry threshold",
  },
];

export function ActivityFeed() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-5 h-5 text-[var(--fresh-green)]" />
          <h2 className="text-lg">Real-Time Activity</h2>
        </div>
        <p className="text-sm text-gray-500">Automated orchestration events</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {mockActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-mono text-gray-900"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {activity.batchId}
                </span>
                <ArrowRight className="w-3 h-3 text-gray-400" />
                <StatusBadge status={activity.status} size="sm" />
              </div>
              <span className="text-xs text-gray-500">{activity.timestamp}</span>
            </div>
            <p className="text-sm text-gray-700 mb-1">{activity.action}</p>
            <p className="text-xs text-gray-500">Reason: {activity.reason}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
