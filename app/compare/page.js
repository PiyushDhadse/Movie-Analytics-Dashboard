"use client";

import { useEffect, useState } from "react";
import { getMovies } from "@/services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function ComparePage() {
  const [movies, setMovies] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getMovies().then(data => {
      // sort alphabetically
      data.sort((a, b) => a.title.localeCompare(b.title));
      setMovies(data);
      if (data.length >= 2) {
        setSelectedMovies([data[0].id, data[1].id]);
      }
    });
  }, []);

  const handleToggleMovie = (id) => {
    if (selectedMovies.includes(id)) {
      setSelectedMovies(selectedMovies.filter(mId => mId !== id));
    } else {
      if (selectedMovies.length >= 4) {
        alert("You can compare up to 4 movies at once.");
        return;
      }
      setSelectedMovies([...selectedMovies, id]);
    }
  };

  const comparisonData = selectedMovies.map(id => {
    return movies.find(m => m.id === id);
  }).filter(Boolean);

  const colors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b"];

  const formatCurrency = (val) => `$${(val / 1e6).toFixed(1)}M`;

  return (
    <div className="pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Movie Comparison
        </h1>
        <p className="text-muted-foreground mt-1">Select up to 4 movies to compare their metrics side-by-side.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Selection Sidebar */}
        <div className="glass-panel rounded-xl p-4 flex flex-col h-[600px]">
          <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Select Movies</h3>
          <input 
            type="text" 
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary mb-4"
          />
          <div className="flex-1 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
            {movies.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase())).map(movie => (
              <label 
                key={movie.id} 
                className={`flex items-center gap-3 p-2 rounded hover:bg-black/5 cursor-pointer select-none transition-colors border ${selectedMovies.includes(movie.id) ? 'border-primary/50 bg-primary/10 text-primary' : 'border-transparent text-foreground'}`}
              >
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={selectedMovies.includes(movie.id)}
                  onChange={() => handleToggleMovie(movie.id)}
                />
                <span className="text-sm font-medium flex-1 truncate">{movie.title}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Charts Area */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {comparisonData.length === 0 ? (
            <div className="glass-panel rounded-xl flex items-center justify-center p-10 h-[600px] text-muted-foreground">
              Select movies from the left panel to begin comparison
            </div>
          ) : (
            <>
              {/* Financial Comparison */}
              <div className="glass-panel p-6 rounded-xl flex flex-col min-h-[350px]">
                <h2 className="text-lg font-semibold mb-6">Financial Comparison (Budget vs Revenue)</h2>
                <div className="flex-1 w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis 
                        dataKey="title" 
                        tick={{ fill: '#6b7280', fontSize: 12 }} 
                        tickLine={false} 
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickFormatter={(v) => v.length > 15 ? v.substring(0, 15) + '...' : v}
                      />
                      <YAxis 
                        tick={{ fill: '#6b7280', fontSize: 12 }} 
                        tickLine={false} 
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickFormatter={(value) => `$${(value / 1e6).toFixed(0)}M`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#111827', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value, name) => [value >= 1e6 ? formatCurrency(value) : value, name === 'revenue' ? 'Revenue' : 'Budget']}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar dataKey="budget" name="Budget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Rating Comparison */}
              <div className="glass-panel p-6 rounded-xl flex flex-col min-h-[300px]">
                <h2 className="text-lg font-semibold mb-6">Rating Comparison</h2>
                <div className="flex-1 w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} layout="vertical" margin={{ left: 100, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                      <XAxis type="number" domain={[0, 10]} tick={{ fill: '#6b7280' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                      <YAxis 
                        dataKey="title" 
                        type="category" 
                        tick={{ fill: '#6b7280', fontSize: 13 }} 
                        axisLine={{ stroke: '#e2e8f0' }} 
                        tickLine={false}
                        tickFormatter={(v) => v.length > 15 ? v.substring(0, 15) + '...' : v}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#111827', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#ec4899' }}
                        cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                      />
                      <Bar dataKey="rating" name="Rating (out of 10)" fill="#ec4899" radius={[0, 4, 4, 0]}>
                        {
                          comparisonData.map((entry, index) => (
                            <cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
