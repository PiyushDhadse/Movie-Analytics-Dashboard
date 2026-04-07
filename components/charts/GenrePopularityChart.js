"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

import { getGenrePopularity } from "@/services/api";
import ChartSkeleton from "@/components/ChartSkeleton";

export default function GenrePopularityChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genres = await getGenrePopularity();
        setData(genres);
      } catch (err) {
        console.error("Failed to fetch genre popularity data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ChartSkeleton />;
  }


  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card px-4 py-3 rounded-xl border border-border/50 shadow-lg text-sm">
          <p className="font-medium text-foreground mb-1">{payload[0].payload.genre}</p>
          <p className="text-muted-foreground">{payload[0].value} movies</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-80 animate-in fade-in duration-700">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 60, left: 40 }}>
          <XAxis 
            dataKey="genre" 
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 400 }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={60}
          />
          
          <YAxis 
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 400 }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
            allowDecimals={false}
            label={{ value: 'Number of movies', angle: -90, position: 'left', offset: 10, fill: '#64748b', fontSize: 11, fontWeight: 500 }}
          />
          
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: '#f8fafc' }}
          />
          
          <Bar 
            dataKey="count" 
            radius={[6, 6, 0, 0]} 
            barSize={32}
            animationDuration={400}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]} 
                fillOpacity={0.8}
                className="hover:fill-opacity-100 transition-opacity"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}