"use client";

import { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function EquityChart({ netProfit }: { netProfit: number }) {
  const data = useMemo(
    () => [
      { day: "Mon", equity: 10000 + netProfit * 0.2 },
      { day: "Tue", equity: 10000 + netProfit * 0.35 },
      { day: "Wed", equity: 10000 + netProfit * 0.25 },
      { day: "Thu", equity: 10000 + netProfit * 0.6 },
      { day: "Fri", equity: 10000 + netProfit }
    ],
    [netProfit]
  );

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="day" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Line type="monotone" dataKey="equity" stroke="#22d3ee" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
