import DashboardNav from "@/components/dashboard/DashboardNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Opal Dashboard",
  description: "Opal task-tracker and team productivity dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      suppressHydrationWarning
      style={{
        minHeight: "100vh",
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-primary), var(--font-secondary), system-ui, sans-serif",
        color: "#ffffff",
      }}
    >
      <DashboardNav />
      <main suppressHydrationWarning style={{ flex: 1, overflow: "auto", position: "relative", background: "#000000" }}>
        {children}
      </main>
    </div>
  );
}
