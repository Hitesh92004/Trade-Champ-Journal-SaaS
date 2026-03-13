"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card, Input } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { Trade } from "@/types/trade";

export default function TradesPage() {
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [search, setSearch] = useState("");
  const [symbol, setSymbol] = useState("");
  const [strategy, setStrategy] = useState("");

  useEffect(() => {
    apiFetch<Trade[]>("/api/trades")
      .then(setAllTrades)
      .catch(() => setAllTrades([]));
  }, []);

  const trades = useMemo(() => {
    return allTrades.filter((trade) => {
      const text = `${trade.ticket} ${trade.symbol}`.toLowerCase();
      return (
        text.includes(search.toLowerCase()) &&
        trade.symbol.toLowerCase().includes(symbol.toLowerCase()) &&
        (trade.strategy_tag || "").toLowerCase().includes(strategy.toLowerCase())
      );
    });
  }, [allTrades, search, symbol, strategy]);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Trades</h1>
      <Card className="grid gap-3 md:grid-cols-4">
        <Input placeholder="Search by ticket / symbol" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Input placeholder="Filter by symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        <Input placeholder="Filter by strategy" value={strategy} onChange={(e) => setStrategy(e.target.value)} />
        <Input type="date" disabled />
      </Card>
      <Card>
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr><th>Ticket</th><th>Symbol</th><th>Strategy</th><th>Date</th><th>P/L</th></tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-t border-slate-800">
                <td><Link className="text-neon" href={`/trades/${trade.id}`}>{trade.ticket}</Link></td>
                <td>{trade.symbol}</td>
                <td>{trade.strategy_tag || "-"}</td>
                <td>{new Date(trade.open_time).toLocaleDateString()}</td>
                <td className={trade.profit >= 0 ? "text-emerald-400" : "text-red-400"}>{trade.profit.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
