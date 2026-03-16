"use client";

import { useState, useRef } from "react";
import { uploadCSV } from "@/services/api";
import { UploadCloud, FileText, BarChart3, List, Hash, Loader2 } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    
    try {
      const result = await uploadCSV(file);
      setAnalysis(result);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to analyze the file. Please ensure it's a valid CSV.");
    } finally {
      setIsUploading(false);
    }
  };

  const renderNumericCard = (col) => (
    <div key={col.column} className="glass-panel p-5 rounded-xl border border-border flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Hash className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-lg">{col.column}</h3>
        <span className="ml-auto text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Numeric</span>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4 mt-auto">
        <div className="bg-background/50 p-3 rounded-lg text-center">
          <div className="text-xs text-muted-foreground uppercase mb-1">Mean</div>
          <div className="font-mono text-sm font-medium">{col.mean !== null ? col.mean.toLocaleString(undefined, {maximumFractionDigits: 2}) : 'N/A'}</div>
        </div>
        <div className="bg-background/50 p-3 rounded-lg text-center">
          <div className="text-xs text-muted-foreground uppercase mb-1">Max</div>
          <div className="font-mono text-sm font-medium">{col.max !== null ? col.max.toLocaleString(undefined, {maximumFractionDigits: 2}) : 'N/A'}</div>
        </div>
        <div className="bg-background/50 p-3 rounded-lg text-center">
          <div className="text-xs text-muted-foreground uppercase mb-1">Min</div>
          <div className="font-mono text-sm font-medium">{col.min !== null ? col.min.toLocaleString(undefined, {maximumFractionDigits: 2}) : 'N/A'}</div>
        </div>
      </div>
    </div>
  );

  const renderCategoricalCard = (col) => {
    if (col.unique_count > 100 || !col.top_categories.length) {
      return (
        <div key={col.column} className="glass-panel p-5 rounded-xl border border-border flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <List className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-lg">{col.column}</h3>
            <span className="ml-auto text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">Categorical</span>
          </div>
          <div className="mt-auto bg-background/50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
            <div className="text-2xl font-bold mb-1">{col.unique_count.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Unique Identifiers / Texts</div>
            <div className="text-xs text-muted-foreground mt-2">(Too many unique values to chart)</div>
          </div>
        </div>
      );
    }

    return (
      <div key={col.column} className="glass-panel p-5 rounded-xl border border-border flex flex-col min-h-[300px] lg:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold text-lg">{col.column}</h3>
          <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Categorical</span>
          <span className="text-xs text-muted-foreground ml-2">{col.unique_count} unique</span>
        </div>
        
        <div className="flex-1 w-full min-h-[200px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={col.top_categories} layout="vertical" margin={{ left: 50, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#6b7280' }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fill: '#6b7280', fontSize: 12 }} 
                axisLine={{ stroke: '#e2e8f0' }} 
                tickLine={false}
                tickFormatter={(v) => v.length > 10 ? v.substring(0, 10) + '...' : v}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#111827', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: 'rgba(0,0,0,0.04)' }}
              />
              <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Dynamic Data Analysis
        </h1>
        <p className="text-muted-foreground mt-1">
          Upload any CSV file. The system will automatically parse the columns and generate relevant insights.
        </p>
      </div>

      {!analysis ? (
        <div 
          className="glass-panel border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-2xl p-12 flex flex-col items-center justify-center min-h-[400px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <UploadCloud className="w-10 h-10 text-primary" />
          </div>
          
          <h3 className="text-2xl font-bold mb-2">Upload your dataset</h3>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            Drag and drop your CSV file here, or click to browse. The engine will dynamically scan your columns and generate a customized dashboard.
          </p>
          
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl font-medium transition-colors"
            >
              Browse Files
            </button>
            
            {file && (
              <button 
                onClick={handleUpload}
                disabled={isUploading}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BarChart3 className="w-5 h-5" />}
                {isUploading ? "Analyzing..." : "Generate Dashboard"}
              </button>
            )}
          </div>
          
          {file && (
            <div className="mt-8 flex items-center gap-2 text-sm font-medium bg-background/50 px-4 py-2 rounded-lg border border-border">
              <FileText className="w-4 h-4 text-accent" />
              {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 glass-panel rounded-xl border border-border">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                {analysis.filename}
              </h2>
              <p className="text-muted-foreground mt-1">
                Parsed {analysis.row_count.toLocaleString()} rows and {analysis.columns.length} columns successfully.
              </p>
            </div>
            <button 
              onClick={() => { setAnalysis(null); setFile(null); }}
              className="mt-4 md:mt-0 px-4 py-2 bg-secondary hover:bg-secondary/80 text-sm font-medium rounded-lg transition-colors"
            >
              Upload Another File
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {analysis.columns.map((col) => 
              col.type === "numeric" ? renderNumericCard(col) : renderCategoricalCard(col)
            )}
          </div>
        </div>
      )}
    </div>
  );
}
