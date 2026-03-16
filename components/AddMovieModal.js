import { useState } from "react";
import { X } from "lucide-react";

export default function AddMovieModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    budget: "",
    revenue: "",
    rating: "",
    year: ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      budget: parseFloat(formData.budget),
      revenue: parseFloat(formData.revenue),
      rating: parseFloat(formData.rating),
      year: parseInt(formData.year)
    });
    
    // Reset form after successful submission
    setFormData({
      title: "", genre: "", budget: "", revenue: "", rating: "", year: ""
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card w-full max-w-md rounded-xl shadow-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold">Add New Movie</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Movie Title</label>
            <input 
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Inception"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Genre</label>
              <input 
                required
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                placeholder="e.g. Sci-Fi"
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Release Year</label>
              <input 
                required
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="2010"
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Budget ($)</label>
              <input 
                required
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="160000000"
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Revenue ($)</label>
              <input 
                required
                type="number"
                name="revenue"
                value={formData.revenue}
                onChange={handleChange}
                placeholder="820000000"
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Rating (out of 10)</label>
            <input 
              required
              type="number"
              step="0.1"
              max="10"
              min="0"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              placeholder="8.8"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="mt-8 flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Save Movie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
