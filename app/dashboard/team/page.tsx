"use client";

import TeamShowcase from "@/components/ui/team-showcase";

export default function TeamPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#000000", padding: "40px 48px", fontFamily: "var(--font-primary), var(--font-secondary), system-ui, sans-serif" }}>
      {/* Stats row - centered */}
      <div style={{ display: "flex", justifyContent: "center", gap: "80px", marginBottom: "60px" }}>
        {[
          { label: "TEAM MEMBERS", value: "6" },
          { label: "ACTIVE THIS WEEK", value: "6" },
          { label: "TASKS ASSIGNED", value: "47" },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <p style={{ fontSize: "56px", fontWeight: 400, color: "#ffffff", fontFamily: "var(--font-primary), monospace", marginBottom: "12px" }}>
              {s.value}
            </p>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-secondary), sans-serif", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Team showcase - centered */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <TeamShowcase />
      </div>
    </div>
  );
}
