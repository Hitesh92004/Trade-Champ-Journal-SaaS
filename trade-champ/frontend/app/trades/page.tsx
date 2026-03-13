import Link from "next/link";
import { Card, Input } from "@/components/ui";

const trades = [
  { id: 1, ticket: 923104, symbol: "EURUSD", strategy: "breakout", profit: 320, date: "2026-01-03" },
  { id: 2, ticket: 923155, symbol: "XAUUSD", strategy: "liquidity sweep", profit: -110, date: "2026-01-04" }
];

export default function TradesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Trades</h1>
      <Card className="grid gap-3 md:grid-cols-4">
        <Input placeholder="Search by ticket / symbol" />
        <Input placeholder="Filter by symbol" />
        <Input placeholder="Filter by strategy" />
        <Input type="date" />
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
                <td>{trade.strategy}</td>
                <td>{trade.date}</td>
                <td>{trade.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
