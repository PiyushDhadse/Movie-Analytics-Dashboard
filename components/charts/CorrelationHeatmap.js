"use client";

import { useEffect, useState } from "react";
import { getCorrelation } from "@/services/api";
import * as ss from "simple-statistics";

export default function CorrelationHeatmap() {
  const [correlation, setCorrelation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCorrelation();

      const budgets = data.map(d => d.budget);
      const revenues = data.map(d => d.revenue);
      const ratings = data.map(d => d.rating);

      const corr = {
        budget_revenue: ss.sampleCorrelation(budgets, revenues),
        budget_rating: ss.sampleCorrelation(budgets, ratings),
        revenue_rating: ss.sampleCorrelation(revenues, ratings)
      };

      setCorrelation(corr);
    };

    fetchData();
  }, []);

  if (!correlation) return <div className="flex items-center justify-center h-full text-muted-foreground">Loading correlation...</div>;

  if (Object.values(correlation).some(v => isNaN(v))) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Not enough data to compute correlation yet.
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden rounded-lg border border-border">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-secondary/50">
            <th className="p-4 font-semibold text-muted-foreground border-b border-border">Metric Pair</th>
            <th className="p-4 font-semibold text-muted-foreground border-b border-border">Correlation Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          <tr className="hover:bg-black/5 transition-colors">
            <td className="p-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              Budget vs Revenue
            </td>
            <td className="p-4 font-mono font-medium">
              <span className={correlation.budget_revenue > 0.5 ? 'text-green-600' : 'text-foreground'}>
                {correlation.budget_revenue.toFixed(2)}
              </span>
            </td>
          </tr>
          <tr className="hover:bg-black/5 transition-colors">
            <td className="p-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              Budget vs Rating
            </td>
            <td className="p-4 font-mono font-medium">
              <span className={correlation.budget_rating > 0.5 ? 'text-green-600' : 'text-foreground'}>
                {correlation.budget_rating.toFixed(2)}
              </span>
            </td>
          </tr>
          <tr className="hover:bg-black/5 transition-colors">
            <td className="p-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-500"></div>
              Revenue vs Rating
            </td>
            <td className="p-4 font-mono font-medium">
              <span className={correlation.revenue_rating > 0.5 ? 'text-green-600' : 'text-foreground'}>
                {correlation.revenue_rating.toFixed(2)}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}