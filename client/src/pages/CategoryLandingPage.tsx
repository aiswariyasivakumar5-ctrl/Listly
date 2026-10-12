import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layers, PlusCircle, LayoutGrid, List, Sparkles } from 'lucide-react';
import { CategoryIcon } from '../components/ui/CategoryIcon';
import { ListingGrid } from '../components/listing/ListingGrid';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { Category, Listing } from '../types';

export const CategoryLandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [catRes, listRes] = await Promise.all([
          api.getCategoryBySlug(slug),
          api.getListings({ category: slug, sort, limit: 16 }),
        ]);

        setCategory(catRes.category);
        setListings(listRes.listings);
      } catch (err) {
        console.error('Failed to load category data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, sort]);

  if (!category && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Category not found</h2>
        <p className="text-slate-500 mt-2 mb-6">The category you are looking for does not exist.</p>
        <Link to="/categories">
          <Button variant="primary">Browse All Categories</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link to="/categories" className="hover:text-brand-600">Categories</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">{category?.name}</span>
      </nav>

      {/* Category Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 shadow-xs">
            <CategoryIcon name={category?.name} className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {category?.name}
            </h1>
            <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
              {category?.description || `Explore active listings in ${category?.name}.`}
            </p>
          </div>
        </div>

        <Link to={`/post?category=${category?.id}`} className="shrink-0">
          <Button variant="primary">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Post in {category?.name}
          </Button>
        </Link>
      </div>

      {/* Subcategory Pills */}
      {category?.children && category.children.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Subcategories
          </h3>
          <div className="flex flex-wrap gap-2">
            <Link
              to={`/category/${category.slug}`}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand-600 text-white shadow-xs"
            >
              All {category.name}
            </Link>
            {category.children.map((sub) => (
              <Link
                key={sub.id}
                to={`/search?category=${sub.slug}`}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 transition-colors"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Control Bar: Count, Sort, View Toggle */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
        <p className="text-sm text-slate-600">
          Showing <strong className="text-slate-900">{listings.length}</strong> active listings
        </p>

        <div className="flex items-center gap-3">
          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="views">Most Viewed</option>
          </select>

          {/* Grid/List switch */}
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setLayout('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                layout === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                layout === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Listings */}
      <ListingGrid
        listings={listings}
        isLoading={isLoading}
        layout={layout}
        emptyTitle={`No listings currently in ${category?.name}`}
        emptyDescription="Be the first to post a classified in this department!"
      />
    </div>
  );
};
