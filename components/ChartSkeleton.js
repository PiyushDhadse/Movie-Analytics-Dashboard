"use client";

export default function ChartSkeleton() {
  return (
    <div className="w-full h-full min-h-80 flex flex-col justify-end gap-4 p-4 animate-pulse">
      {/* Simulation of a bar/scatter chart layout */}
      <div className="flex items-end justify-between h-full w-full gap-2 px-2">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="bg-muted/30 rounded-t-lg w-full transition-all duration-500"
            style={{ 
              height: `${Math.floor(Math.random() * 60) + 20}%`,
              opacity: (i % 3 === 0 ? 0.4 : 0.6) 
            }}
          />
        ))}
      </div>
      
      {/* Simulation of X-axis labels */}
      <div className="flex justify-between w-full h-4 px-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-muted/20 rounded-full h-2 w-12" />
        ))}
      </div>
    </div>
  );
}
