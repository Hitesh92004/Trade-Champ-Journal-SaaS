"use client";

import { useEffect, useMemo, useState } from "react";
import { EquityChart } from "@/components/equity-chart";
import { Card } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { DashboardOverview } from "@/types/dashboard";

const fallback: DashboardOverview = {
  total_trades: 0,
  win_rate: 0,
  profit_factor: 0,
  expectancy: 0,
  net_profit: 0,
  max_drawdown: 0
};

export default function DashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview>(fallback);

  useEffect(() => {
    apiFetch<DashboardOverview>("/api/dashboard/overview")
      .then(setOverview)
      .catch(() => setOverview(fallback));
  }, []);

  const metrics = useMemo(
    () => [
      ["Total Trades", overview.total_trades.toString()],
      ["Win Rate", `${overview.win_rate}%`],
      ["Profit Factor", overview.profit_factor.toString()],
      ["Expectancy", `$${overview.expectancy}`],
      ["Net Profit", `$${overview.net_profit}`],
      ["Max Drawdown", `${overview.max_drawdown}`]
    ],
    [overview]
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Trading Journal Dashboard</h1>
      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-1 text-2xl font-bold text-neon">{value}</p>
          </Card>
        ))}
      </section>
      <Card>
        <h2 className="mb-4 text-xl font-semibold">Equity Curve</h2>
        <EquityChart netProfit={overview.net_profit} />
      </Card>
      <section className="grid gap-4 md:grid-cols-3">
        <Card><h3 className="font-semibold">Profit by Symbol</h3><p className="text-slate-400">Automatically aggregated from synced MT5 trades.</p></Card>
        <Card><h3 className="font-semibold">Session Performance</h3><p className="text-slate-400">Asia, London, and NY sessions are tracked separately.</p></Card>
        <Card><h3 className="font-semibold">Strategy Win Rate</h3><p className="text-slate-400">Breakout, scalping, liquidity sweep, trend continuation.</p></Card>
      </section>
      <Card>
        <h2 className="text-xl font-semibold">Prop Firm Tracker</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <p>Remaining Daily Loss: <span className="text-neon">from prop settings</span></p>
          <p>Remaining Drawdown: <span className="text-neon">from prop settings</span></p>
          <p>Profit Target Progress: <span className="text-neon">auto-calculated</span></p>
        </div>
      </Card>
    </div>
  );
}
