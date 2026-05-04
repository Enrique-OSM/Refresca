import { motion } from "motion/react";
import { useState } from "react";
import { Package, Calendar, TrendingUp, Save, X } from "lucide-react";
import { inventoryAPI } from "../../utils/api";
import { toast } from "sonner";

export function ProductEntry() {
  const [formData, setFormData] = useState({
    batchId: "",
    product: "",
    stock: "",
    cost: "",
    expiry: "",
    salesPace: "medium",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await inventoryAPI.create({
        batchId: formData.batchId,
        product: formData.product,
        stock: parseInt(formData.stock),
        cost: parseFloat(formData.cost),
        expiry: formData.expiry,
        salesPace: formData.salesPace as "high" | "medium" | "low",
      });

      if (response.success) {
        toast.success("Producto agregado exitosamente al inventario");
        // Reset form
        setFormData({
          batchId: "",
          product: "",
          stock: "",
          cost: "",
          expiry: "",
          salesPace: "medium",
        });
      } else {
        toast.error(`Error: ${response.error || "No se pudo agregar el producto"}`);
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Error al conectar con el servidor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      batchId: "",
      product: "",
      stock: "",
      cost: "",
      expiry: "",
      salesPace: "medium",
    });
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <h2 className="text-2xl mb-2">Add New Product Batch</h2>
          <p className="text-gray-600">
            Enter product details to enable automated waste prevention orchestration
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Batch ID */}
          <div>
            <label className="flex items-center gap-2 mb-2 text-gray-700">
              <Package className="w-4 h-4" />
              Batch ID
            </label>
            <input
              type="text"
              value={formData.batchId}
              onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
              placeholder="e.g., BTH-234"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--fresh-green)] focus:border-transparent outline-none font-mono"
              style={{ fontFamily: "var(--font-mono)" }}
            />
          </div>

          {/* Product Name */}
          <div>
            <label className="flex items-center gap-2 mb-2 text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              placeholder="e.g., Organic Strawberries"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--fresh-green)] focus:border-transparent outline-none"
            />
          </div>

          {/* Stock and Cost */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-gray-700">Stock Quantity</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="e.g., 45"
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--fresh-green)] focus:border-transparent outline-none font-mono"
                style={{ fontFamily: "var(--font-mono)" }}
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700">Cost per Unit ($)</label>
              <input
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                placeholder="e.g., 6.50"
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--fresh-green)] focus:border-transparent outline-none font-mono"
                style={{ fontFamily: "var(--font-mono)" }}
              />
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="flex items-center gap-2 mb-2 text-gray-700">
              <Calendar className="w-4 h-4" />
              Expiry Date
            </label>
            <input
              type="date"
              value={formData.expiry}
              onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
              required
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--fresh-green)] focus:border-transparent outline-none font-mono"
              style={{ fontFamily: "var(--font-mono)" }}
            />
          </div>

          {/* Sales Pace */}
          <div>
            <label className="flex items-center gap-2 mb-3 text-gray-700">
              <TrendingUp className="w-4 h-4" />
              Expected Sales Pace
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["high", "medium", "low"].map((pace) => (
                <button
                  key={pace}
                  type="button"
                  onClick={() => setFormData({ ...formData, salesPace: pace })}
                  className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                    formData.salesPace === pace
                      ? "border-[var(--fresh-green)] bg-[var(--fresh-green-light)] text-[var(--fresh-green-dark)]"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <span className="capitalize">{pace}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              This helps the system predict waste risk and trigger appropriate events
            </p>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Automated Orchestration
            </h4>
            <p className="text-sm text-blue-800">
              Once submitted, ReFresca's n8n workflows will automatically monitor this batch
              and trigger Flash Sales, Internal Offers, or Donation events based on expiry
              dates and sales pace to minimize waste.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[var(--fresh-green)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{submitting ? "Guardando..." : "Save Product Batch"}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={submitting}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
              <span>Reset</span>
            </button>
          </div>
        </form>
      </div>

      {/* Quick Tips */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="text-2xl mb-2">🎯</div>
          <h4 className="text-sm font-semibold mb-1">Smart Triggers</h4>
          <p className="text-xs text-gray-600">
            Flash Sales auto-activate at 3 days before expiry for medium/low pace items
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="text-2xl mb-2">💚</div>
          <h4 className="text-sm font-semibold mb-1">Donation Ready</h4>
          <p className="text-xs text-gray-600">
            Items with 1 day left are auto-flagged for local food bank partnerships
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="text-2xl mb-2">📊</div>
          <h4 className="text-sm font-semibold mb-1">SDG Tracking</h4>
          <p className="text-xs text-gray-600">
            All saved batches count toward UN SDG 12 (Responsible Consumption) metrics
          </p>
        </div>
      </div>
    </motion.div>
  );
}
