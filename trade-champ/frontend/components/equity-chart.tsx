"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { day: "Mon", equity: 10200 },
  { day: "Tue", equity: 10620 },
  { day: "Wed", equity: 10480 },
  { day: "Thu", equity: 11050 },
  { day: "Fri", equity: 11640 }
];

export function EquityChart() {
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
