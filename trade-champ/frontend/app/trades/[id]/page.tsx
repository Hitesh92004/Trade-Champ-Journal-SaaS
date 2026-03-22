"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, Input } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { Trade } from "@/types/trade";

type TradeDetail = Trade & { rr_ratio: number };

export default function TradeDetailPage() {
  const params = useParams<{ id: string }>();
  const [trade, setTrade] = useState<TradeDetail | null>(null);

  useEffect(() => {
    if (!params.id) return;
    apiFetch<TradeDetail>(`/api/trades/${params.id}`)
      .then(setTrade)
      .catch(() => setTrade(null));
  }, [params.id]);

  if (!trade) {
    return <p className="text-slate-400">Loading trade detail...</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Trade Detail #{trade.ticket}</h1>
      <Card className="grid gap-3 md:grid-cols-2">
        <p>Entry Price: {trade.entry_price}</p>
        <p>Exit Price: {trade.exit_price ?? "-"}</p>
        <p>RR Ratio: {trade.rr_ratio}</p>
        <p>Duration: {trade.trade_duration_minutes ?? 0}m</p>
        <p>Profit/Loss: {trade.profit}</p>
        <p>Strategy: {trade.strategy_tag || "untagged"}</p>
      </Card>
      <Card className="space-y-3">
        <h2 className="text-lg font-semibold">Trade Notes</h2>
        <textarea
          defaultValue={trade.notes || ""}
          className="min-h-24 w-full rounded-md border border-slate-600 bg-slate-900/60 p-3"
          placeholder="What did you execute well?"
        />
        <label className="block text-sm">Upload Chart Screenshot</label>
        <Input type="file" />
      </Card>
    </div>
  );
}
