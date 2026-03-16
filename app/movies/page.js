"use client";

import { useEffect, useState } from "react";
import { getMovies, addMovie } from "@/services/api";
import AddMovieModal from "@/components/AddMovieModal";
import { Search, Plus } from "lucide-react";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const data = await getMovies();
      // sort by newest added by default (highest ID)
      data.sort((a, b) => b.id - a.id);
      setMovies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleAddMovie = async (movieData) => {
    try {
      await addMovie(movieData);
      setIsModalOpen(false);
      fetchMovies();
    } catch (err) {
      console.error("Failed to add movie", err);
      alert("Failed to add movie. Check console.");
    }
  };

  const formatGenre = (genreStr) => {
    try {
      if (!genreStr) return "";
      
      // Robust JSON detection
      if (genreStr.includes("[") && genreStr.includes("]")) {
        const start = genreStr.indexOf("[");
        const end = genreStr.lastIndexOf("]") + 1;
        const jsonPart = genreStr.substring(start, end);
        const genres = JSON.parse(jsonPart);
        if (Array.isArray(genres)) {
          return genres.map(g => g.name || g).join(", ");
        }
      }
      
      // Fallback: clean up 'Unknown' and trailing junk
      return genreStr.replace("Unknown", "").split("[")[0].trim();
    } catch (e) {
      return genreStr.replace("Unknown", "").split("[")[0].trim();
    }
  };

  const filteredMovies = movies.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase()) || 
    formatGenre(m.genre).toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (val) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Movie Database
          </h1>
          <p className="text-muted-foreground mt-1">Manage and view all movies in the system.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Movie
        </button>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search by title or genre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background/50 border border-border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="text-sm text-muted-foreground ml-auto">
            Showing {filteredMovies.length} results
          </div>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/30 text-muted-foreground text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Genre</th>
                <th className="p-4 font-semibold">Year</th>
                <th className="p-4 font-semibold">Budget</th>
                <th className="p-4 font-semibold">Revenue</th>
                <th className="p-4 font-semibold">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-muted-foreground">
                    Loading movies...
                  </td>
                </tr>
              ) : filteredMovies.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-muted-foreground">
                    No movies found matching your search.
                  </td>
                </tr>
              ) : (
                filteredMovies.map(movie => (
                  <tr key={movie.id} className="hover:bg-black/5 transition-colors group">
                    <td className="p-4 font-medium text-foreground">{movie.title}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border whitespace-nowrap">
                        {formatGenre(movie.genre)}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{movie.year}</td>
                    <td className="p-4 font-mono text-sm">{formatCurrency(movie.budget)}</td>
                    <td className="p-4 font-mono text-sm text-green-600 font-medium">{formatCurrency(movie.revenue)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <div className="font-bold text-accent">{movie.rating.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">/ 10</div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <AddMovieModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddMovie} 
      />
    </div>
  );
}
