"use client";

import { useEffect, useState } from "react";
import TopGrossingChart from "@/components/charts/TopGrossingChart";
import BudgetRevenueChart from "@/components/charts/BudgetRevenueChart";
import GenrePopularityChart from "@/components/charts/GenrePopularityChart";
import CorrelationHeatmap from "@/components/charts/CorrelationHeatmap";
import StatCard from "@/components/StatCard";
import { Film, UserSquare2, DollarSign, TrendingUp } from "lucide-react";
import axios from "axios";

export default function Home() {
  const [summary, setSummary] = useState({
    total_movies: 0,
    avg_rating: 0,
    total_revenue: 0,
    total_budget: 0
  });

  useEffect(() => {
    axios.get("http://localhost:8000/analytics/summary")
      .then(res => setSummary(res.data))
      .catch(err => console.error(err));
  }, []);

  const formatCurrency = (val) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-1">Welcome back. Here's what's happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Movies" 
          value={summary.total_movies.toLocaleString()} 
          icon={Film} 
          subtitle="+12% from last month" 
          trend="up" 
        />
        <StatCard 
          title="Average Rating" 
          value={`${summary.avg_rating} / 10`} 
          icon={UserSquare2} 
        />
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(summary.total_revenue)} 
          icon={DollarSign} 
          subtitle="+4.2% from last month"
          trend="up"
        />
        <StatCard 
          title="Total Budget" 
          value={formatCurrency(summary.total_budget)} 
          icon={TrendingUp} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass-panel p-6 rounded-xl flex flex-col min-h-[400px]">
          <h2 className="text-lg font-semibold mb-6">Top Grossing Movies</h2>
          <div className="flex-1 -ml-4">
            <TopGrossingChart />
          </div>
        </div>
        <div className="glass-panel p-6 rounded-xl flex flex-col min-h-[400px]">
          <h2 className="text-lg font-semibold mb-6">Genre Popularity</h2>
          <div className="flex-1 -ml-4">
            <GenrePopularityChart />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="glass-panel p-6 rounded-xl min-h-[400px]">
          <h2 className="text-lg font-semibold mb-6">Budget vs Revenue Analysis</h2>
          <div className="w-full h-[350px]">
            <BudgetRevenueChart />
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-xl min-h-[400px]">
          <h2 className="text-lg font-semibold mb-6">Correlation Heatmap</h2>
          <div className="w-full h-[350px]">
            <CorrelationHeatmap />
          </div>
        </div>
      </div>
    </div>
  );
}
