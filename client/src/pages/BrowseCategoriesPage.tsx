import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, Search } from 'lucide-react';
import { CategoryIcon } from '../components/ui/CategoryIcon';
import { api } from '../services/api';
import { Category } from '../types';

export const BrowseCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getCategories()
      .then((res) => setCategories(res.categories))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredCategories = categories.filter((cat) => {
    if (!filterQuery.trim()) return true;
    const matchParent = cat.name.toLowerCase().includes(filterQuery.toLowerCase());
    const matchChild = cat.children?.some((c) =>
      c.name.toLowerCase().includes(filterQuery.toLowerCase())
    );
    return matchParent || matchChild;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">All Categories</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse All Marketplace Categories
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Explore our curated departments and specialized subcategories to find exactly what you need.
          </p>
        </div>

        {/* Filter input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter categories..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl border p-6 space-y-4">
              <div className="w-10 h-10 bg-slate-200 rounded-xl" />
              <div className="h-5 bg-slate-200 rounded w-1/2" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-brand-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shadow-xs">
                    <CategoryIcon name={cat.name} className="w-6 h-6" />
                  </div>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 group"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                <Link to={`/category/${cat.slug}`}>
                  <h2 className="text-xl font-bold text-slate-900 hover:text-brand-600 transition-colors">
                    {cat.name}
                  </h2>
                </Link>

                <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                  {cat.description}
                </p>

                {/* Subcategories */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  {cat.children?.map((sub) => (
                    <Link
                      key={sub.id}
                      to={`/search?category=${sub.slug}`}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-colors group"
                    >
                      <span className="font-medium text-xs sm:text-sm">{sub.name}</span>
                      <span className="text-[11px] text-slate-400 group-hover:text-brand-600">
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-xs text-slate-400">
                <span>{cat.children?.length || 0} subcategories available</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
