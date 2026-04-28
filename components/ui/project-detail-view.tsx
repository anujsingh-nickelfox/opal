"use client";

import * as React from "react";
import {
  FileText,
  Calendar,
  Tag,
  Paperclip,
  Users,
  MoreHorizontal,
  Download,
  Plus,
  ArrowRight,
  Edit2,
  X,
  Share2,
} from "lucide-react";

// Figma was removed from lucide-react — using inline SVG instead
const FigmaIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 38 57"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
    <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 0 1-19 0z" fill="#0ACF83" />
    <path d="M19 0v19h9.5a9.5 9.5 0 0 0 0-19H19z" fill="#FF7262" />
    <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
    <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
  </svg>
);

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ─── Type Definitions ─────────────────────────────────────────────────────────

type Assignee = {
  name: string;
  avatarUrl: string;
};

type ProjectTag = {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
};

type Attachment = {
  name: string;
  size: string;
  type: "pdf" | "figma";
};

type SubTask = {
  id: number;
  task: string;
  category: string;
  status: "Completed" | "In Progress" | "Pending";
  dueDate: string;
};

export type ProjectDetailViewProps = {
  breadcrumbs: { label: string; href: string }[];
  title: string;
  status: string;
  assignees: Assignee[];
  dateRange: {
    start: string;
    end: string;
  };
  tags: ProjectTag[];
  description: string;
  attachments: Attachment[];
  subTasks: SubTask[];
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: SubTask["status"] }) => {
  const statusStyles: Record<SubTask["status"], string> = {
    Completed:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-700/60",
    "In Progress":
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700/60",
    Pending:
      "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-400 border-gray-200 dark:border-gray-700/60",
  };
  return (
    <Badge variant="outline" className={cn("font-medium", statusStyles[status])}>
      {status}
    </Badge>
  );
};

const FileIcon = ({ type }: { type: Attachment["type"] }) => {
  if (type === "pdf") return <FileText className="h-6 w-6 text-red-500" />;
  if (type === "figma") return <FigmaIcon className="h-6 w-6" />;
  return <Paperclip className="h-6 w-6 text-muted-foreground" />;
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProjectDetailView({
  breadcrumbs,
  title,
  status,
  assignees,
  dateRange,
  tags,
  description,
  attachments,
  subTasks,
}: ProjectDetailViewProps) {
  return (
    <div style={{ width: "100%", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "28px", overflow: "hidden" }}>
      <div>
        {/* ── Header / Breadcrumbs ── */}
        <div style={{ padding: "20px 28px", borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", fontFamily: "var(--font-secondary), sans-serif" }}>
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  <a
                    href={crumb.href}
                    style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}
                  >
                    {crumb.label.toUpperCase()}
                  </a>
                  {i < breadcrumbs.length - 1 && (
                    <span style={{ margin: "0 4px", userSelect: "none" }}>/</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Button variant="ghost" size="icon" aria-label="Share" style={{ color: "rgba(255,255,255,0.6)" }}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Edit" style={{ color: "rgba(255,255,255,0.6)" }}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Close" style={{ color: "rgba(255,255,255,0.6)" }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div style={{ padding: "28px 32px" }}>
          {/* ── Title ── */}
          <h1
            style={{ fontSize: "32px", fontWeight: 600, color: "#ffffff", fontFamily: "var(--font-secondary), sans-serif", marginBottom: "24px" }}
          >
            {title.toUpperCase()}
          </h1>

          {/* ── Meta Grid ── */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm"
          >
            {/* Status */}
            <div className="flex items-start gap-3">
              <MoreHorizontal className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-muted-foreground mb-1">Status</p>
                <Badge
                  variant="outline"
                  className="font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700/60"
                >
                  <span className="mr-1.5 h-2 w-2 rounded-full bg-yellow-500 animate-pulse inline-block" />
                  {status}
                </Badge>
              </div>
            </div>

            {/* Assignees */}
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "rgba(255,255,255,0.7)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Assignee</p>
                <div className="flex flex-col gap-3">
                  {assignees.map((assignee) => (
                    <div key={assignee.name} className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={assignee.avatarUrl}
                          alt={assignee.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-[14px] font-bold">
                          {assignee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", fontFamily: "var(--font-secondary), sans-serif", letterSpacing: "0.02em" }}>{assignee.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-muted-foreground mb-1">Date</p>
                <p className="font-medium flex items-center gap-2 flex-wrap">
                  {dateRange.start}
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  {dateRange.end}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-start gap-3">
              <Tag className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-muted-foreground mb-1">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag.label} variant={tag.variant}>
                      {tag.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start gap-3 col-span-1 md:col-span-2">
              <FileText className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: "rgba(255,255,255,0.6)" }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: "12px", fontFamily: "var(--font-secondary), sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>DESCRIPTION</p>
                <p style={{ fontSize: "18px", fontWeight: 400, color: "#ffffff", lineHeight: 1.7, fontFamily: "var(--font-secondary), sans-serif" }}>{description}</p>
              </div>
            </div>
          </div>

          {/* ── Attachments ── */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <Paperclip className="h-5 w-5 text-muted-foreground" />
                Attachments
                <Badge variant="secondary">{attachments.length}</Badge>
              </h3>
              <Button variant="ghost" size="sm" className="text-primary">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {attachments.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors cursor-pointer"
                >
                  <FileIcon type={file.type} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                </div>
              ))}
              {/* Add attachment */}
              <div className="flex items-center justify-center p-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/40 transition-colors group">
                <Plus className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </div>
          </div>

          {/* ── Task List ── */}
          <div className="space-y-4">
            <h3 className="font-semibold">Task List</h3>
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[60px]">No</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-b border-border transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {String(task.id).padStart(2, "0")}
                      </TableCell>
                      <TableCell className="font-medium">{task.task}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs font-normal">
                          {task.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={task.status} />
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {task.dueDate}
                      </TableCell>
                    </tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
