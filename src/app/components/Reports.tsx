import { motion } from "motion/react";
import { FileText, Download, Eye, Calendar, TrendingUp, Filter, Plus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { reportsAPI, Report } from "../../utils/api";

export function Reports() {
  const [filterType, setFilterType] = useState<"all" | "weekly" | "monthly" | "quarterly">("all");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      const response = await reportsAPI.getAll();
      if (response.success && response.data) {
        setReports(response.data);
      } else {
        setErrorMsg(response.error || "Failed to load reports");
      }
      setLoading(false);
    };
    fetchReports();
  }, []);

  const filteredReports = reports.filter(
    (report) => filterType === "all" || report.type === filterType
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "weekly":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "monthly":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "quarterly":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-5 h-5 text-[var(--fresh-green)]" />
              <h2 className="text-2xl">Impact Reports</h2>
            </div>
            <p className="text-gray-600">
              Historical waste prevention performance and SDG 12 metrics
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--fresh-green)] focus:border-transparent outline-none bg-white"
              >
                <option value="all">All Reports</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            <button 
              onClick={() => {
                const testUserId = 1;
                fetch(`https://wearingatouchdown-evg5hkhnaddyh2hf.eastus-01.azurewebsites.net/webhook-test/5beb5272-083f-46e4-9d4e-4348f728fb8d?userId=${testUserId}`, {
                  method: 'GET',
                  mode: 'no-cors'
                }).catch(err => console.error('Error calling webhook:', err));
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--fresh-green)] text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Create Report</span>
            </button>
          </div>
        </div>
      </div>
      {/* Summary Card */}
      <div className="bg-gradient-to-br from-[var(--fresh-green)] to-[var(--fresh-green-dark)] rounded-lg shadow-sm p-6 text-white">
        <h3 className="text-xl mb-4">SDG 12 Impact Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-emerald-100 text-sm mb-1">Total Food Saved (2026)</p>
            <p
              className="text-3xl font-mono"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              24,313 <span className="text-lg">kg</span>
            </p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm mb-1">Economic Impact (2026)</p>
            <p
              className="text-3xl font-mono"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              $174,400
            </p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm mb-1">Average Waste Reduction</p>
            <p
              className="text-3xl font-mono"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              65%
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-emerald-400">
          <p className="text-sm text-emerald-100">
            Your contributions align with <strong>UN Sustainable Development Goal 12</strong> -
            Responsible Consumption and Production, helping reduce food waste in Monterrey's SME sector.
          </p>
        </div>
      </div>
      {/* Reports Grid */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="flex justify-center items-center h-32 bg-white rounded-lg shadow-sm border border-gray-200">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--fresh-green)]" />
          </div>
        ) : errorMsg ? (
          <div className="flex justify-center items-center h-32 bg-white rounded-lg shadow-sm border border-gray-200 text-red-500">
            Error: {errorMsg}
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex justify-center items-center h-32 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-500">
            No reports found
          </div>
        ) : (
          filteredReports.map((report, index) => (
          <motion.div
            key={report.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Report Info */}
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-3 bg-[var(--fresh-green-light)] rounded-lg">
                    <FileText className="w-5 h-5 text-[var(--fresh-green)]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg">{report.title}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs border capitalize ${getTypeColor(
                          report.type
                        )}`}
                      >
                        {report.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{report.period}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span
                        className="font-mono"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {report.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 ml-14">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Food Saved</p>
                    <p
                      className="text-lg font-mono"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {report.foodSaved.toLocaleString()} <span className="text-sm text-gray-500">kg</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Loss Prevented</p>
                    <p
                      className="text-lg font-mono"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      ${report.lossPrevented.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Waste Reduction</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-[var(--fresh-green)]" />
                      <p
                        className="text-lg font-mono text-[var(--fresh-green)]"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {report.wasteReduction}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 lg:ml-4">
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--fresh-green)] text-white rounded-lg hover:opacity-90 transition-opacity">
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
