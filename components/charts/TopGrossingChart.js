"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { getTopGrossing } from "@/services/api";

export default function TopGrossingChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const movies = await getTopGrossing();
      setData(movies);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis 
            dataKey="title" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            tickFormatter={(value) => value.length > 10 ? value.substring(0, 10) + '...' : value}
          />
          <YAxis 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            tickFormatter={(value) => `$${(value / 1e6).toFixed(0)}M`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#111827', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#8b5cf6' }}
            formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
          />
          <Bar dataKey="revenue" fill="#4318ff" radius={[4, 4, 0, 0]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
