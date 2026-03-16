"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { getGenrePopularity } from "@/services/api";

export default function GenrePopularityChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const genres = await getGenrePopularity();
      setData(genres);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis 
            dataKey="genre" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#111827', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#22c55e' }}
            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
          />
          <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}