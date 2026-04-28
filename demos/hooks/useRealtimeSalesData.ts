"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface SaleDataPoint {
  time: string;
  sales: number;
}

export interface LatestPayment {
  id: string;
  amount: number;
  product: string;
  customer: string;
  time: string;
}

const PRODUCTS = [
  "Opal Pro Plan",
  "Opal Team Seat",
  "Opal Enterprise",
  "Opal Starter",
  "Opal Add-on Pack",
  "Opal Analytics Module",
  "Opal Storage Upgrade",
];

const CUSTOMERS = [
  "Alex Chen",
  "Priya Nair",
  "Marcus Johnson",
  "Sofia Rivera",
  "Liam Patel",
  "Emma Williams",
  "Noah Garcia",
  "Olivia Kim",
  "James Thompson",
  "Isabella Martinez",
];

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

function getCurrentTimeString(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export function useRealtimeSalesData() {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [salesCount, setSalesCount] = useState<number>(0);
  const [averageSale, setAverageSale] = useState<number>(0);
  const [salesChartData, setSalesChartData] = useState<SaleDataPoint[]>([]);
  const [cumulativeRevenueData, setCumulativeRevenueData] = useState<SaleDataPoint[]>([]);
  const [latestPayments, setLatestPayments] = useState<LatestPayment[]>([]);

  const totalRevenueRef = useRef<number>(0);
  const salesCountRef = useRef<number>(0);

  const addSale = useCallback(() => {
    const amount = parseFloat(randomBetween(29, 599).toFixed(2));
    const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
    const timeStr = getCurrentTimeString();

    // Update refs
    totalRevenueRef.current = parseFloat((totalRevenueRef.current + amount).toFixed(2));
    salesCountRef.current += 1;

    const newAvg = parseFloat((totalRevenueRef.current / salesCountRef.current).toFixed(2));

    setTotalRevenue(totalRevenueRef.current);
    setSalesCount(salesCountRef.current);
    setAverageSale(newAvg);

    // Append to per-second chart
    setSalesChartData((prev) => {
      const next = [...prev, { time: timeStr, sales: amount }];
      return next.slice(-60); // keep last 60 ticks
    });

    // Append cumulative
    setCumulativeRevenueData((prev) => {
      const next = [...prev, { time: timeStr, sales: totalRevenueRef.current }];
      return next.slice(-60);
    });

    // Prepend to payments list (latest first)
    const newPayment: LatestPayment = {
      id: generateId(),
      amount,
      product,
      customer,
      time: timeStr,
    };
    setLatestPayments((prev) => [newPayment, ...prev].slice(0, 10));
  }, []);

  useEffect(() => {
    // Seed with a few initial data points so charts aren't empty on first render
    for (let i = 0; i < 8; i++) {
      addSale();
    }

    // Stream a new sale every 1-2.5 seconds to simulate real-time
    let timeoutId: ReturnType<typeof setTimeout>;

    const schedule = () => {
      const delay = randomBetween(1000, 2500);
      timeoutId = setTimeout(() => {
        addSale();
        schedule();
      }, delay);
    };

    schedule();

    return () => clearTimeout(timeoutId);
  }, [addSale]);

  return {
    totalRevenue,
    salesCount,
    averageSale,
    salesChartData,
    cumulativeRevenueData,
    latestPayments,
  };
}
