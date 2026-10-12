import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronDown, Sparkles } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { api } from '../../services/api';
import { Category } from '../../types';

interface SearchBarProps {
  initialQuery?: string;
  initialCategory?: string;
  className?: string;
  compact?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  initialCategory = 'all',
  className = '',
  compact = false,
}) => {
  const navigate = useNavigate();
  const { selectedLocation } = useLocation();
  const [q, setQ] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setQ(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    api.getCategories()
      .then((res) => setCategories(res.categories))
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.append('q', q.trim());
    if (category && category !== 'all') params.append('category', category);
    if (selectedLocation && selectedLocation !== 'all') params.append('location', selectedLocation);

    navigate(`/search?${params.toString()}`);
  };

  if (compact) {
    return (
      <form onSubmit={handleSearch} className={`relative flex items-center ${className}`}>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search jobs, housing, goods..."
          className="w-full bg-slate-100 focus:bg-white border border-transparent focus:border-brand-500 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className={`bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200/80 p-2 flex flex-col md:flex-row items-stretch md:items-center gap-2 ${className}`}
    >
      {/* Search Input */}
      <div className="relative flex-1 flex items-center">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search listings (e.g. Toyota RAV4, Herman Miller, Graphic Designer)..."
          className="w-full pl-11 pr-4 py-3 bg-transparent text-slate-900 placeholder-slate-400 text-sm md:text-base outline-none font-medium"
        />
      </div>

      <div className="hidden md:block w-px h-8 bg-slate-200" />

      {/* Category Dropdown */}
      <div className="relative flex items-center md:w-56 shrink-0 bg-slate-50 md:bg-transparent rounded-xl px-2 py-1 md:p-0">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full appearance-none bg-transparent py-2.5 px-3 pr-8 text-sm font-medium text-slate-700 outline-none cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <React.Fragment key={cat.id}>
              <option value={cat.slug} className="font-semibold text-slate-900">
                {cat.name}
              </option>
              {cat.children?.map((sub) => (
                <option key={sub.id} value={sub.slug} className="text-slate-600 pl-4">
                  &nbsp;&nbsp;↳ {sub.name}
                </option>
              ))}
            </React.Fragment>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
      </div>

      <div className="hidden md:block w-px h-8 bg-slate-200" />

      {/* Location Badge */}
      <button
        type="button"
        onClick={() => navigate('/locations')}
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-100 text-slate-600 text-sm font-medium shrink-0 transition-colors text-left"
        title="Change location"
      >
        <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
        <span className="truncate max-w-[140px]">{selectedLocation}</span>
      </button>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-md shadow-brand-600/20 hover:shadow-brand-600/30 flex items-center justify-center gap-2 shrink-0"
      >
        <Search className="w-4 h-4" />
        <span>Search</span>
      </button>
    </form>
  );
};
