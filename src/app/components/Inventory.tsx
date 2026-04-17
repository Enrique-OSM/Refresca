import { motion } from "motion/react";
import { Search, Filter, Download, RefreshCw } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { FreshnessGauge } from "./FreshnessGauge";
import { useState } from "react";

interface InventoryItem {
  id: string;
  batchId: string;
  product: string;
  stock: number;
  cost: number;
  expiry: string;
  daysLeft: number;
  status: "fresh" | "flash" | "internal" | "donate" | "expired";
  salesPace: "high" | "medium" | "low";
}

const mockInventory: InventoryItem[] = [
  {
    id: "1",
    batchId: "BTH-102",
    product: "Organic Strawberries",
    stock: 45,
    cost: 6.5,
    expiry: "2026-04-17",
    daysLeft: 3,
    status: "flash",
    salesPace: "medium",
  },
  {
    id: "2",
    batchId: "BTH-156",
    product: "Fresh Pineapples",
    stock: 28,
    cost: 4.2,
    expiry: "2026-04-19",
    daysLeft: 5,
    status: "internal",
    salesPace: "low",
  },
  {
    id: "3",
    batchId: "BTH-189",
    product: "Red Apples",
    stock: 120,
    cost: 2.8,
    expiry: "2026-04-25",
    daysLeft: 11,
    status: "fresh",
    salesPace: "high",
  },
  {
    id: "4",
    batchId: "BTH-089",
    product: "Bananas",
    stock: 15,
    cost: 1.5,
    expiry: "2026-04-15",
    daysLeft: 1,
    status: "donate",
    salesPace: "low",
  },
  {
    id: "5",
    batchId: "BTH-078",
    product: "Mangoes",
    stock: 8,
    cost: 5.2,
    expiry: "2026-04-13",
    daysLeft: -1,
    status: "expired",
    salesPace: "low",
  },
  {
    id: "6",
    batchId: "BTH-201",
    product: "Green Grapes",
    stock: 62,
    cost: 3.9,
    expiry: "2026-04-22",
    daysLeft: 8,
    status: "fresh",
    salesPace: "medium",
  },
  {
    id: "7",
    batchId: "BTH-145",
    product: "Watermelon",
    stock: 18,
    cost: 8.5,
    expiry: "2026-04-16",
    daysLeft: 2,
    status: "flash",
    salesPace: "medium",
  },
];

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInventory = mockInventory.filter(
    (item) =>
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product or batch ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--fresh-green)] focus:border-transparent outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--fresh-green)] text-white rounded-lg hover:opacity-90 transition-opacity">
              <RefreshCw className="w-4 h-4" />
              <span>Sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                  Batch ID
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                  Cost/Unit
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                  Freshness
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                  Sales Pace
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInventory.map((item, index) => (
                <motion.tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="font-mono text-sm text-gray-900"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {item.batchId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="text-sm font-mono"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {item.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="text-sm font-mono"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      ${item.cost.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <FreshnessGauge daysLeft={item.daysLeft} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.salesPace === "high"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.salesPace === "medium"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.salesPace}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
