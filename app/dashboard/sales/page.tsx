"use client";

import { SalesDashboard } from "@/components/ui/live-sales-dashboard";

export default function SalesPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#000000", padding: "40px 48px", fontFamily: "var(--font-primary), var(--font-secondary), system-ui, sans-serif" }}>
      {/* Component */}
      <div>
        <SalesDashboard />
      </div>
    </div>
  );
}
