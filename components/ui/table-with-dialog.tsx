"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// ─── Types ─────────────────────────────────────────────────────────────────

type UserStatus = "Active" | "Inactive" | "Suspended";

type User = {
  id: string;
  name: string;
  email: string;
  location: string;
  status: UserStatus;
  balance: string;
};

// ─── Data ──────────────────────────────────────────────────────────────────

const users: User[] = [
  {
    id: "1",
    name: "Alex Thompson",
    email: "alex.t@company.com",
    location: "San Francisco, US",
    status: "Active",
    balance: "$1,250.00",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.c@company.com",
    location: "Singapore",
    status: "Active",
    balance: "$600.00",
  },
  {
    id: "3",
    name: "James Wilson",
    email: "j.wilson@company.com",
    location: "London, UK",
    status: "Inactive",
    balance: "$650.00",
  },
  {
    id: "4",
    name: "Maria Garcia",
    email: "m.garcia@company.com",
    location: "Madrid, Spain",
    status: "Active",
    balance: "$0.00",
  },
  {
    id: "5",
    name: "David Kim",
    email: "d.kim@company.com",
    location: "Seoul, KR",
    status: "Suspended",
    balance: "-$1,000.00",
  },
  {
    id: "6",
    name: "Emma Watson",
    email: "emma.w@company.com",
    location: "Paris, FR",
    status: "Active",
    balance: "$2,340.00",
  },
  {
    id: "7",
    name: "Michael Brown",
    email: "m.brown@company.com",
    location: "Toronto, CA",
    status: "Active",
    balance: "$890.00",
  },
  {
    id: "8",
    name: "Lisa Anderson",
    email: "l.anderson@company.com",
    location: "Sydney, AU",
    status: "Inactive",
    balance: "$450.00",
  },
  {
    id: "9",
    name: "Robert Taylor",
    email: "r.taylor@company.com",
    location: "Berlin, DE",
    status: "Active",
    balance: "$1,780.00",
  },
  {
    id: "10",
    name: "Jennifer Martinez",
    email: "j.martinez@company.com",
    location: "Mexico City, MX",
    status: "Active",
    balance: "$920.00",
  },
  {
    id: "11",
    name: "Christopher Lee",
    email: "c.lee@company.com",
    location: "Tokyo, JP",
    status: "Active",
    balance: "$3,450.00",
  },
  {
    id: "12",
    name: "Amanda White",
    email: "a.white@company.com",
    location: "New York, US",
    status: "Active",
    balance: "$1,120.00",
  },
  {
    id: "13",
    name: "Daniel Johnson",
    email: "d.johnson@company.com",
    location: "Chicago, US",
    status: "Inactive",
    balance: "$0.00",
  },
  {
    id: "14",
    name: "Sophie Martin",
    email: "s.martin@company.com",
    location: "Lyon, FR",
    status: "Active",
    balance: "$2,890.00",
  },
  {
    id: "15",
    name: "William Turner",
    email: "w.turner@company.com",
    location: "Manchester, UK",
    status: "Active",
    balance: "$1,560.00",
  },
  {
    id: "16",
    name: "Olivia Davis",
    email: "o.davis@company.com",
    location: "Melbourne, AU",
    status: "Active",
    balance: "$2,100.00",
  },
  {
    id: "17",
    name: "Matthew Clark",
    email: "m.clark@company.com",
    location: "Dublin, IE",
    status: "Suspended",
    balance: "-$450.00",
  },
  {
    id: "18",
    name: "Emily Rodriguez",
    email: "e.rodriguez@company.com",
    location: "Barcelona, ES",
    status: "Active",
    balance: "$1,780.00",
  },
  {
    id: "19",
    name: "Andrew Scott",
    email: "a.scott@company.com",
    location: "Edinburgh, UK",
    status: "Inactive",
    balance: "$340.00",
  },
  {
    id: "20",
    name: "Rachel Green",
    email: "r.green@company.com",
    location: "Vancouver, CA",
    status: "Active",
    balance: "$2,670.00",
  },
  {
    id: "21",
    name: "Kevin Murphy",
    email: "k.murphy@company.com",
    location: "Cork, IE",
    status: "Active",
    balance: "$890.00",
  },
  {
    id: "22",
    name: "Jessica Adams",
    email: "j.adams@company.com",
    location: "Los Angeles, US",
    status: "Active",
    balance: "$4,230.00",
  },
  {
    id: "23",
    name: "Thomas Wright",
    email: "t.wright@company.com",
    location: "Auckland, NZ",
    status: "Inactive",
    balance: "$120.00",
  },
  {
    id: "24",
    name: "Natalie Portman",
    email: "n.portman@company.com",
    location: "Jerusalem, IL",
    status: "Active",
    balance: "$5,600.00",
  },
  {
    id: "25",
    name: "Patrick Stewart",
    email: "p.stewart@company.com",
    location: "Yorkshire, UK",
    status: "Active",
    balance: "$3,120.00",
  },
  {
    id: "26",
    name: "Megan Fox",
    email: "m.fox@company.com",
    location: "Detroit, US",
    status: "Active",
    balance: "$1,890.00",
  },
  {
    id: "27",
    name: "Stephen King",
    email: "s.king@company.com",
    location: "Bangor, US",
    status: "Inactive",
    balance: "$560.00",
  },
  {
    id: "28",
    name: "Charlotte Bronte",
    email: "c.bronte@company.com",
    location: "Yorkshire, UK",
    status: "Active",
    balance: "$2,340.00",
  },
  {
    id: "29",
    name: "Harrison Ford",
    email: "h.ford@company.com",
    location: "Wyoming, US",
    status: "Active",
    balance: "$7,800.00",
  },
  {
    id: "30",
    name: "Emma Stone",
    email: "e.stone@company.com",
    location: "Scottsdale, US",
    status: "Active",
    balance: "$4,560.00",
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

const statusVariant = (
  status: UserStatus
): "default" | "secondary" | "destructive" => {
  if (status === "Active") return "default";
  if (status === "Inactive") return "secondary";
  return "destructive";
};

// ─── Component ─────────────────────────────────────────────────────────────

export default function TableWithDialog() {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [allChecked, setAllChecked] = useState(false);

  const toggleAll = () => {
    if (allChecked) {
      setCheckedIds(new Set());
      setAllChecked(false);
    } else {
      setCheckedIds(new Set(users.map((u) => u.id)));
      setAllChecked(true);
    }
  };

  const toggleRow = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)" }}>
      {/* Table header info bar */}
      <div className="flex items-center justify-between px-6 py-4" style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <p style={{ fontSize: "16px", fontWeight: 600, color: "#ffffff", fontFamily: "var(--font-secondary), sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          CLIENTS{" "}
          <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>
            · {users.length} USERS
          </span>
        </p>
        {checkedIds.size > 0 && (
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-primary), monospace" }}>
            {checkedIds.size} SELECTED
          </p>
        )}
      </div>

      {/* Scrollable table body */}
      <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
        <Table>
          {/* Sticky header */}
          <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10">
                <Checkbox
                  checked={allChecked}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-muted/50 transition-colors"
                data-state={checkedIds.has(user.id) ? "selected" : undefined}
              >
                <TableCell>
                  <Checkbox
                    checked={checkedIds.has(user.id)}
                    onCheckedChange={() => toggleRow(user.id)}
                    aria-label={`Select ${user.name}`}
                  />
                </TableCell>

                {/* Name + avatar initials */}
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-primary select-none">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>

                <TableCell className="text-muted-foreground text-sm">
                  {user.email}
                </TableCell>
                <TableCell className="text-sm">{user.location}</TableCell>

                <TableCell>
                  <Badge
                    variant={statusVariant(user.status)}
                    className={
                      user.status === "Suspended" ? "text-white" : ""
                    }
                  >
                    {user.status === "Active" && (
                      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                    )}
                    {user.status}
                  </Badge>
                </TableCell>

                <TableCell className="text-right font-mono text-sm">
                  <span
                    className={
                      user.balance.startsWith("-")
                        ? "text-destructive"
                        : user.balance === "$0.00"
                        ? "text-muted-foreground"
                        : "text-foreground"
                    }
                  >
                    {user.balance}
                  </span>
                </TableCell>

                <TableCell className="text-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogDescription>
                          Full information about{" "}
                          <span className="font-medium text-foreground">
                            {user.name}
                          </span>
                        </DialogDescription>
                      </DialogHeader>

                      {/* Avatar + name hero */}
                      <div className="flex items-center gap-3 py-2">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {/* Detail rows */}
                      <div className="space-y-3 text-sm border-t border-border pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Location
                          </span>
                          <span className="font-medium">{user.location}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Status</span>
                          <Badge variant={statusVariant(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Balance</span>
                          <span
                            className={`font-mono font-medium ${
                              user.balance.startsWith("-")
                                ? "text-destructive"
                                : "text-foreground"
                            }`}
                          >
                            {user.balance}
                          </span>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          {/* Sticky footer */}
          <TableFooter className="sticky bottom-0 bg-background z-10 shadow-[0_-1px_0_0_hsl(var(--border))]">
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5} className="font-medium">
                Total Users:{" "}
                <span className="font-semibold">{users.length}</span>
              </TableCell>
              <TableCell className="text-right font-mono font-semibold">
                $2,500.00
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
