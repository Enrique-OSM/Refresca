import { motion } from "motion/react";
import { Search, Filter, Download, RefreshCw } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { FreshnessGauge } from "./FreshnessGauge";
import { useState, useEffect } from "react";
import { inventoryAPI } from "../../utils/api";
import { toast } from "sonner";

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

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    setLoading(true);
    const response = await inventoryAPI.getAll();

    if (response.success && response.data) {
      setInventory(response.data);
    } else {
      console.error("Error loading inventory:", response.error);
      toast.error("Error al cargar el inventario");
      setInventory([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredInventory = inventory.filter(
    (item) => {
      const matchesSearch = item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.batchId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" || item.status === filterStatus;
      return matchesSearch && matchesFilter;
    }
  );

  const handleExport = () => {
    if (filteredInventory.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }

    const headers = ["Batch ID", "Product", "Stock", "Cost/Unit", "Expiry", "Days Left", "Status", "Sales Pace"];
    const csvContent = [
      headers.join(","),
      ...filteredInventory.map(item => 
        [
          item.batchId,
          `"${item.product.replace(/"/g, '""')}"`, // Escape comillas para nombres con espacios/comas
          item.stock,
          item.cost.toFixed(2),
          item.expiry,
          item.daysLeft,
          item.status,
          item.salesPace
        ].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Inventario exportado con éxito");
  };

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
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="capitalize">Filter {filterStatus !== "all" && `(${filterStatus})`}</span>
              </button>
              
              {isFilterOpen && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                  <button 
                    onClick={() => { setFilterStatus("all"); setIsFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${filterStatus === "all" ? "font-medium bg-gray-50" : ""}`}
                  >
                    All Statuses
                  </button>
                  {["fresh", "flash", "internal", "donate", "expired"].map((status) => (
                    <button 
                      key={status}
                      onClick={() => { setFilterStatus(status); setIsFilterOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 capitalize ${filterStatus === status ? "font-medium bg-gray-50" : ""}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={fetchInventory}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--fresh-green)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>Sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-[var(--fresh-green)]" />
            <span className="ml-3 text-gray-600">Cargando inventario...</span>
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">No hay productos en el inventario</p>
            <p className="text-sm text-gray-400">Agrega productos usando el formulario "Add Product"</p>
          </div>
        ) : (
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
        )}
      </div>
    </motion.div>
  );
}
