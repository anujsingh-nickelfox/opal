"use client";

import TableWithDialog from "@/components/ui/table-with-dialog";

export default function MailPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#000000", padding: "40px 48px", fontFamily: "var(--font-primary), var(--font-secondary), system-ui, sans-serif" }}>
      {/* Component */}
      <div style={{ height: "calc(100vh - 200px)" }}>
        <TableWithDialog />
      </div>
    </div>
  );
}
