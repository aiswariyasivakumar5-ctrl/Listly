import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { SearchBar } from '../components/search/SearchBar';
import { FilterSidebar } from '../components/search/FilterSidebar';
import { ListingGrid } from '../components/listing/ListingGrid';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { Listing, Category, Pagination } from '../types';

export const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const location = searchParams.get('location') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const isFree = searchParams.get('isFree') === 'true';
  const condition = searchParams.get('condition') || 'all';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Component state
  const [categories, setCategories] = useState<Category[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
    hasMore: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch categories once
  useEffect(() => {
    api.getCategories()
      .then((res) => setCategories(res.categories))
      .catch((err) => console.error(err));
  }, []);

  // Update query params helper
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === '' || val === 'all') {
          next.delete(key);
        } else {
          next.set(key, val);
        }
      });
      // Reset page when filters change (unless page itself is updated)
      if (!('page' in updates)) {
        next.delete('page');
      }
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  // Execute backend search when params change
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        const res = await api.getListings({
          q,
          category,
          location,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          isFree,
          condition: condition !== 'all' ? condition : undefined,
          sort,
          page,
          limit: 12,
        });

        setListings(res.listings);
        setPagination(res.pagination);
      } catch (err) {
        console.error('Failed to search listings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [q, category, location, minPrice, maxPrice, isFree, condition, sort, page]);

  const handleClearAll = () => {
    const next = new URLSearchParams();
    if (q) next.set('q', q);
    setSearchParams(next);
  };

  // Compute active filters for chip display
  const activeChips: { key: string; label: string; onRemove: () => void }[] = [];
  if (category && category !== 'all') {
    activeChips.push({
      key: 'category',
      label: `Category: ${category}`,
      onRemove: () => updateParams({ category: null }),
    });
  }
  if (minPrice || maxPrice) {
    activeChips.push({
      key: 'price',
      label: `Price: ₹${minPrice || '0'} - ₹${maxPrice || '∞'}`,
      onRemove: () => updateParams({ minPrice: null, maxPrice: null }),
    });
  }
  if (isFree) {
    activeChips.push({
      key: 'free',
      label: 'Free items only',
      onRemove: () => updateParams({ isFree: null }),
    });
  }
  if (condition && condition !== 'all') {
    activeChips.push({
      key: 'condition',
      label: `Condition: ${condition}`,
      onRemove: () => updateParams({ condition: null }),
    });
  }
  if (location && location !== 'all') {
    activeChips.push({
      key: 'location',
      label: `Location: ${location}`,
      onRemove: () => updateParams({ location: null }),
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Search Bar */}
      <SearchBar initialQuery={q} initialCategory={category} />

      {/* Main Content Area: Sidebar + Grid */}
      <div className="flex items-start gap-8">
        {/* Filter Sidebar */}
        <FilterSidebar
          categories={categories}
          selectedCategory={category}
          onCategoryChange={(slug) => updateParams({ category: slug })}
          minPrice={minPrice}
          onMinPriceChange={(val) => updateParams({ minPrice: val })}
          maxPrice={maxPrice}
          onMaxPriceChange={(val) => updateParams({ maxPrice: val })}
          isFree={isFree}
          onIsFreeChange={(val) => updateParams({ isFree: val ? 'true' : null })}
          condition={condition}
          onConditionChange={(val) => updateParams({ condition: val })}
          sort={sort}
          onSortChange={(val) => updateParams({ sort: val })}
          onClearAll={handleClearAll}
          isOpenOnMobile={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />

        {/* Results Body */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Top Bar: Count, Mobile filter toggle, Active chips, View switcher */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900">
                  {q ? `Search results for "${q}"` : 'All Classified Listings'}
                </h1>
                <p className="text-xs text-slate-500">
                  Showing {listings.length} of {pagination.total} matching items
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" />
                  Filters {activeChips.length > 0 && `(${activeChips.length})`}
                </button>

                {/* View switcher */}
                <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
                  <button
                    onClick={() => setLayout('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      layout === 'grid'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLayout('list')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      layout === 'list'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
                <span className="font-semibold text-slate-500 mr-1">Active filters:</span>
                {activeChips.map((chip) => (
                  <span
                    key={chip.key}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 text-brand-800 border border-brand-200/80 text-xs font-medium"
                  >
                    {chip.label}
                    <button
                      onClick={chip.onRemove}
                      className="hover:text-brand-950 p-0.5 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={handleClearAll}
                  className="text-xs font-semibold text-brand-600 hover:underline ml-1"
                >
                  Reset All
                </button>
              </div>
            )}
          </div>

          {/* Listing Grid */}
          <ListingGrid
            listings={listings}
            isLoading={isLoading}
            layout={layout}
            emptyTitle={q ? `No listings matching "${q}"` : 'No listings match these criteria'}
            emptyDescription="Try broadening your filters, checking different categories, or removing price boundaries."
            onClearFilters={handleClearAll}
          />

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => updateParams({ page: String(pagination.page - 1) })}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <div className="text-xs font-semibold text-slate-600 px-3">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasMore}
                onClick={() => updateParams({ page: String(pagination.page + 1) })}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
