import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { Category } from '../../types';
import { Button } from '../ui/Button';

interface FilterSidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (slug: string) => void;
  minPrice: string;
  onMinPriceChange: (val: string) => void;
  maxPrice: string;
  onMaxPriceChange: (val: string) => void;
  isFree: boolean;
  onIsFreeChange: (val: boolean) => void;
  condition: string;
  onConditionChange: (val: string) => void;
  sort: string;
  onSortChange: (val: string) => void;
  onClearAll: () => void;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

const CONDITIONS = [
  { label: 'All Conditions', value: 'all' },
  { label: 'Brand New', value: 'New' },
  { label: 'Like New', value: 'Like New' },
  { label: 'Excellent', value: 'Excellent' },
  { label: 'Good', value: 'Good' },
  { label: 'Fair', value: 'Fair' },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  isFree,
  onIsFreeChange,
  condition,
  onConditionChange,
  sort,
  onSortChange,
  onClearAll,
  isOpenOnMobile = false,
  onCloseMobile,
}) => {
  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-brand-600" />
          <h3 className="font-bold text-slate-900 text-base">Filter Results</h3>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs text-brand-600 hover:text-brand-800 font-medium flex items-center gap-1 hover:underline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      {/* Sort */}
      <div>
        <label
          htmlFor="filter-sort-select"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
        >
          Sort By
        </label>
        <select
          id="filter-sort-select"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        >
          <option value="newest">Newest First</option>
          <option value="relevance">Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="views">Most Viewed</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Category
        </label>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onCategoryChange('all')}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectedCategory === 'all'
                ? 'bg-brand-50 font-bold text-brand-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <div key={cat.id} className="space-y-0.5">
              <button
                type="button"
                onClick={() => onCategoryChange(cat.slug)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat.slug
                    ? 'bg-brand-50 font-bold text-brand-700'
                    : 'text-slate-800 hover:bg-slate-100 font-medium'
                }`}
              >
                {cat.name}
              </button>
              {cat.children && cat.children.length > 0 && (
                <div className="pl-4 space-y-0.5">
                  {cat.children.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => onCategoryChange(sub.slug)}
                      className={`w-full text-left px-2.5 py-1 rounded text-xs transition-colors ${
                        selectedCategory === sub.slug
                          ? 'bg-brand-100/70 font-semibold text-brand-800'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            disabled={isFree}
            className="w-full rounded-xl border border-slate-300 p-2 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-100"
          />
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            disabled={isFree}
            className="w-full rounded-xl border border-slate-300 p-2 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-100"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isFree}
            onChange={(e) => onIsFreeChange(e.target.checked)}
            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <span>Free items only</span>
        </label>
      </div>

      {/* Condition */}
      <div>
        <label
          htmlFor="filter-condition-select"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
        >
          Condition
        </label>
        <select
          id="filter-condition-select"
          value={condition}
          onChange={(e) => onConditionChange(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        >
          {CONDITIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm sticky top-24 h-fit">
        {content}
      </aside>

      {/* Mobile drawer */}
      {isOpenOnMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white p-6 shadow-2xl z-10 overflow-y-auto flex flex-col">
            <div className="flex justify-end mb-2">
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Button variant="primary" className="w-full" onClick={onCloseMobile}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
