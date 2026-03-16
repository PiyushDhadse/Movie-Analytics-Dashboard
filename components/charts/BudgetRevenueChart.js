"use client";

import { useEffect, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getBudgetRevenue } from "@/services/api";

export default function BudgetRevenueChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const movies = await getBudgetRevenue();
      setData(movies);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            type="number" 
            dataKey="budget" 
            name="Budget" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            tickFormatter={(value) => `$${(value / 1e6).toFixed(0)}M`}
          />
          <YAxis 
            type="number" 
            dataKey="revenue" 
            name="Revenue" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            tickFormatter={(value) => `$${(value / 1e6).toFixed(0)}M`}
          />
          <Tooltip 
            cursor={{ strokeDasharray: "3 3", stroke: "#e2e8f0" }} 
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#111827', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
          />
          <Scatter data={data} fill="#ec4899" fillOpacity={0.6} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
