import { EquityChart } from "@/components/equity-chart";
import { Card } from "@/components/ui";

const metrics = [
  ["Total Trades", "248"],
  ["Win Rate", "61.3%"],
  ["Profit Factor", "1.78"],
  ["Expectancy", "$43.21"],
  ["Net Profit", "$10,721"],
  ["Max Drawdown", "-4.6%"]
];

export default function DashboardPage() {
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
        <EquityChart />
      </Card>
      <section className="grid gap-4 md:grid-cols-3">
        <Card><h3 className="font-semibold">Profit by Symbol</h3><p className="text-slate-400">EURUSD +$3,400 • XAUUSD +$2,900</p></Card>
        <Card><h3 className="font-semibold">Session Performance</h3><p className="text-slate-400">London session holds highest expectancy.</p></Card>
        <Card><h3 className="font-semibold">Strategy Win Rate</h3><p className="text-slate-400">Breakout 67% • Scalping 54%</p></Card>
      </section>
      <Card>
        <h2 className="text-xl font-semibold">Prop Firm Tracker</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <p>Remaining Daily Loss: <span className="text-neon">$1,250</span></p>
          <p>Remaining Drawdown: <span className="text-neon">$3,850</span></p>
          <p>Profit Target Progress: <span className="text-neon">58%</span></p>
        </div>
      </Card>
    </div>
  );
}
