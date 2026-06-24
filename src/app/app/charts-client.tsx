"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export function ChartsClient({
  type,
  data,
}: {
  type: "production" | "games";
  data: unknown[];
}) {
  if (type === "production") {
    return (
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data as { month: string; videos: number }[]}>
          <defs>
            <linearGradient id="gRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dc2626" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1f1f23" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#8a8a92"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#8a8a92"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "#131314",
              border: "1px solid #2a2a30",
              borderRadius: 6,
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="videos"
            stroke="#dc2626"
            strokeWidth={2}
            fill="url(#gRed)"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={
          data as {
            game: string;
            ctr: number;
            retention: number;
            views: number;
            subs: number;
          }[]
        }
      >
        <CartesianGrid stroke="#1f1f23" vertical={false} />
        <XAxis
          dataKey="game"
          stroke="#8a8a92"
          fontSize={10}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#8a8a92"
          fontSize={10}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#131314",
            border: "1px solid #2a2a30",
            borderRadius: 6,
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 10 }} />
        <Bar dataKey="ctr" name="CTR %" fill="#dc2626" radius={[3, 3, 0, 0]} />
        <Bar
          dataKey="retention"
          name="Retenção %"
          fill="#c5ff3d"
          radius={[3, 3, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
