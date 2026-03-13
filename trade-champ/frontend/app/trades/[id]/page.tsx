import { Card, Input } from "@/components/ui";

export default function TradeDetailPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Trade Detail</h1>
      <Card className="grid gap-3 md:grid-cols-2">
        <p>Entry Price: 1.09231</p>
        <p>Exit Price: 1.09520</p>
        <p>RR Ratio: 2.1</p>
        <p>Duration: 2h 24m</p>
        <p>Profit/Loss: +$320</p>
        <p>Strategy: breakout</p>
      </Card>
      <Card className="space-y-3">
        <h2 className="text-lg font-semibold">Trade Notes</h2>
        <textarea className="min-h-24 w-full rounded-md border border-slate-600 bg-slate-900/60 p-3" placeholder="What did you execute well?" />
        <label className="block text-sm">Upload Chart Screenshot</label>
        <Input type="file" />
      </Card>
    </div>
  );
}
