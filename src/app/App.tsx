import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LayoutDashboard, Package, PlusCircle, Leaf, FileText } from "lucide-react";
import { Dashboard } from "./components/Dashboard";
import { Inventory } from "./components/Inventory";
import { ProductEntry } from "./components/ProductEntry";
import { Reports } from "./components/Reports";
import { Toaster } from "sonner";

type Tab = "dashboard" | "inventory" | "entry" | "reports";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const tabs = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory" as Tab, label: "Inventory", icon: Package },
    { id: "entry" as Tab, label: "Add Product", icon: PlusCircle },
    { id: "reports" as Tab, label: "Reports", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Toaster position="top-right" richColors />
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--fresh-green)] rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className="text-xl tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  ReFresca
                </h1>
                <p className="text-xs text-gray-500">
                  Food Waste Prevention Orchestrator
                </p>
              </div>
            </div>

            {/* SDG Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[var(--fresh-green-light)] rounded-full border border-[var(--fresh-green)]">
              <span className="text-xs font-semibold text-[var(--fresh-green-dark)]">
                UN SDG 12
              </span>
              <span className="text-xs text-[var(--fresh-green-dark)]">
                Responsible Consumption
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-1 -mb-px" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-3 transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--fresh-green)]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--fresh-green)]"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard />
            </motion.div>
          )}
          {activeTab === "inventory" && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Inventory />
            </motion.div>
          )}
          {activeTab === "entry" && (
            <motion.div
              key="entry"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProductEntry />
            </motion.div>
          )}
          {activeTab === "reports" && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Reports />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              © 2026 ReFresca. Empowering SMEs in Monterrey to reduce food waste.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-[var(--fresh-green)] transition-colors">
                n8n Workflows
              </a>
              <a href="#" className="hover:text-[var(--fresh-green)] transition-colors">
                Analytics
              </a>
              <a href="#" className="hover:text-[var(--fresh-green)] transition-colors">
                Settings
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
