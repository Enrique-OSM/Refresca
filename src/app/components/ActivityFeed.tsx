import { motion } from "motion/react";
import { Clock, ArrowRight, Loader2 } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { useState, useEffect } from "react";
import { dashboardAPI, Activity } from "../../utils/api";

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      const response = await dashboardAPI.getActivities();
      if (response.success && response.data) {
        setActivities(response.data);
      } else {
        setErrorMsg(response.error || "Unknown error");
      }
      setLoading(false);
    };
    fetchActivities();
  }, []);
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
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        ) : errorMsg ? (
          <div className="flex justify-center items-center h-32 text-red-500 p-4 text-center text-sm">
            Error: {errorMsg}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-gray-500">
            No activity yet
          </div>
        ) : (
          activities.map((activity, index) => (
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
          ))
        )}
      </div>
    </div>
  );
}
