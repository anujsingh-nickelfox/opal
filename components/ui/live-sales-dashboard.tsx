"use client";

import React, { FC, useMemo } from "react";
import {
  useRealtimeSalesData,
  SaleDataPoint,
  LatestPayment,
} from "@/demos/hooks/useRealtimeSalesData";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  DollarSign,
  Repeat2,
  TrendingUp,
  BarChart,
  Clock,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

// ─── MetricCard ───────────────────────────────────────────────────────────────

interface MetricCardProps {
  title: string;
  value: number;
  unit?: string;
  icon?: React.ReactNode;
  description?: string;
}

const MetricCard: FC<MetricCardProps> = ({
  title,
  value,
  unit = "",
  icon,
  description,
}) => (
  <div style={{ flex: 1, minWidth: "220px", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "20px" }}>
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
      <span style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-secondary), sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</span>
      <span style={{ color: "rgba(255,255,255,0.5)" }}>{icon}</span>
    </div>
    <div>
      <div style={{ fontSize: "28px", fontWeight: 400, color: "#ffffff", fontFamily: "var(--font-primary), monospace" }}>
        {unit}
        {typeof value === "number"
          ? value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : "0.00"}
      </div>
      {description && (
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "4px", fontFamily: "var(--font-secondary), sans-serif" }}>{description}</p>
      )}
    </div>
  </div>
);

// ─── RealtimeChart ────────────────────────────────────────────────────────────

interface RealtimeChartProps {
  data: SaleDataPoint[];
  title: string;
  dataKey: keyof SaleDataPoint;
  lineColor: string;
  tooltipFormatter?: (value: number) => string;
  legendName: string;
}

const RealtimeChart: FC<RealtimeChartProps> = React.memo(
  ({ data, title, dataKey, lineColor, tooltipFormatter, legendName }) => {
    const chartData = useMemo(() => {
      const validData = data || [];
      if (validData.length === 0) return [];

      const now = new Date();
      const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);

      const filteredData = validData.filter((point) => {
        if (!point.time) return false;
        const timeParts = point.time.split(":");
        if (timeParts.length !== 3) return true;
        const pointTime = new Date();
        pointTime.setHours(
          parseInt(timeParts[0]),
          parseInt(timeParts[1]),
          parseInt(timeParts[2])
        );
        return pointTime >= twoMinutesAgo;
      });

      return filteredData.length > 0 ? filteredData : validData.slice(-10);
    }, [data]);

    const chartKey = useMemo(
      () => `chart-${title}-${dataKey}`,
      [title, dataKey]
    );

    const colors = {
      grid: "#e5e7eb",
      axis: "#6b7280",
      tooltipBg: "#ffffff",
      tooltipBorder: "#d1d5db",
      tooltipText: "#111827",
      legend: "#6b7280",
    };

    return (
      <Card className="flex-1 min-w-[300px] max-w-full lg:max-w-[calc(50%-16px)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart className="h-5 w-5 text-blue-600" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: "100%", height: "350px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                key={chartKey}
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={colors.grid}
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="time"
                  stroke={colors.axis}
                  fontSize={12}
                  interval="preserveStartEnd"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(tick) => {
                    if (typeof tick === "string" && tick.includes(":")) {
                      const parts = tick.split(":");
                      return parts.length >= 3
                        ? `${parts[1]}:${parts[2]}`
                        : tick;
                    }
                    return tick;
                  }}
                />
                <YAxis
                  stroke={colors.axis}
                  fontSize={12}
                  tickFormatter={
                    tooltipFormatter || ((value) => value.toString())
                  }
                />
                <RechartsTooltip
                  cursor={{ stroke: lineColor, strokeWidth: 1 }}
                  contentStyle={{
                    backgroundColor: colors.tooltipBg,
                    borderColor: colors.tooltipBorder,
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{ color: colors.tooltipText }}
                  labelStyle={{ color: colors.legend }}
                  formatter={
                    tooltipFormatter
                      ? (value: unknown) => {
                          const numValue =
                            typeof value === "number"
                              ? value
                              : parseFloat(String(value)) || 0;
                          return [tooltipFormatter(numValue), legendName];
                        }
                      : undefined
                  }
                />
                <Legend
                  wrapperStyle={{
                    color: colors.legend,
                    paddingTop: "10px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke={lineColor}
                  strokeWidth={2}
                  dot={false}
                  name={legendName}
                  connectNulls={false}
                  isAnimationActive={chartData.length <= 1}
                  animationBegin={0}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }
);
RealtimeChart.displayName = "RealtimeChart";

// ─── SalesDashboard ───────────────────────────────────────────────────────────

export const SalesDashboard: FC = () => {
  const {
    totalRevenue,
    cumulativeRevenueData,
    salesCount,
    averageSale,
    salesChartData,
    latestPayments,
  } = useRealtimeSalesData();

  const safeSalesChartData = Array.isArray(salesChartData) ? salesChartData : [];
  const safeCumulativeRevenueData = Array.isArray(cumulativeRevenueData)
    ? cumulativeRevenueData
    : [];
  const safeLatestPayments = Array.isArray(latestPayments) ? latestPayments : [];

  return (
    <TooltipProvider>
      <div style={{ width: "100%", color: "#ffffff", display: "flex", flexDirection: "column", gap: "32px", fontFamily: "var(--font-primary), var(--font-secondary), system-ui, sans-serif" }}>
        {/* Header - CENTERED */}
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <h1 style={{ fontSize: "36px", fontWeight: 400, color: "#ffffff", fontFamily: "var(--font-primary), monospace", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
            ACTIVE SALES TRACKER
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-secondary), sans-serif", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "16px" }}>
            REAL-TIME INSIGHTS INTO YOUR SALES PERFORMANCE
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "20px", fontSize: "12px", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-secondary), sans-serif" }}>
              <span style={{ position: "relative", display: "flex", height: "8px", width: "8px" }}>
                <span style={{ position: "absolute", display: "inline-flex", height: "100%", width: "100%", borderRadius: "50%", background: "#10b981", opacity: 0.75, animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite" }} />
                <span style={{ position: "relative", display: "inline-flex", borderRadius: "50%", height: "8px", width: "8px", background: "#10b981" }} />
              </span>
              LIVE DATA STREAMING
            </span>
          </div>
        </div>

        <Separator />

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Revenue"
            value={totalRevenue || 0}
            unit="$"
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            description="Cumulative revenue generated"
          />
          <MetricCard
            title="Total Transactions"
            value={salesCount || 0}
            icon={<Repeat2 className="h-4 w-4 text-muted-foreground" />}
            description="Number of sales recorded"
          />
          <MetricCard
            title="Average Sale"
            value={averageSale || 0}
            unit="$"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            description="Average value per transaction"
          />
          <Card className="flex-1 min-w-[220px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Activity Status
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                </span>
                Live
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Data streaming in real-time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="flex flex-wrap gap-4 justify-center">
          <RealtimeChart
            data={safeSalesChartData}
            title="Sales per Second"
            dataKey="sales"
            lineColor="#3b82f6"
            tooltipFormatter={formatCurrency}
            legendName="Sales Amount"
          />
          <RealtimeChart
            data={safeCumulativeRevenueData}
            title="Cumulative Revenue Trend"
            dataKey="sales"
            lineColor="#8b5cf6"
            tooltipFormatter={formatCurrency}
            legendName="Cumulative Revenue"
          />
        </div>

        {/* Latest Payments */}
        <Card className="col-span-full max-h-[450px] overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Latest Payments
            </CardTitle>
            <CardDescription>
              Recently completed transactions, updated live.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[270px]">
              <div className="divide-y divide-border">
                {safeLatestPayments.length === 0 ? (
                  <p className="p-4 text-center text-muted-foreground">
                    No payments yet…
                  </p>
                ) : (
                  safeLatestPayments.map((payment: LatestPayment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <DollarSign className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-base leading-tight">
                            {formatCurrency(payment.amount || 0)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {payment.product}{" "}
                            <span className="text-foreground/60">by</span>{" "}
                            {payment.customer}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className="text-xs font-normal">
                          {payment.time}
                        </Badge>
                        <span className="text-xs text-emerald-600 font-medium">
                          Completed
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="pt-4 border-t text-sm text-muted-foreground">
            <p>Displaying the 10 most recent transactions.</p>
          </CardFooter>
        </Card>
      </div>
    </TooltipProvider>
  );
};
