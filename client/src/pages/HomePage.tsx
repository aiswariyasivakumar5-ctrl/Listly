import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Search,
  MapPin,
  TrendingUp,
  Tag,
  Briefcase,
  Home,
  ShoppingBag,
  Car,
  Wrench,
  Clock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { SearchBar } from '../components/search/SearchBar';
import { ListingCard } from '../components/listing/ListingCard';
import { CategoryIcon } from '../components/ui/CategoryIcon';
import { useLocation } from '../context/LocationContext';
import { api } from '../services/api';
import { Category, Listing } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedLocation } = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentListings, setRecentListings] = useState<Listing[]>([]);
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [catRes, listRes] = await Promise.all([
          api.getCategories(),
          api.getListings({ limit: 8, sort: 'newest' }),
        ]);

        setCategories(catRes.categories);
        setRecentListings(listRes.listings);
        // Featured could be top viewed or items with photos
        setFeaturedListings(listRes.listings.slice(0, 4));
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-slate-50 to-slate-50 pt-10 pb-12 sm:pt-16 sm:pb-20 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Everything local.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-800">
                Simple, transparent & secure.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Find housing, jobs, goods, services, gigs, and community discussions in{' '}
              <Link
                to="/"
                className="inline-flex items-center gap-1 font-bold text-brand-700 underline hover:text-brand-800"
                title="Click to change city"
              >
                <MapPin className="w-4 h-4 inline" />
                <span>{selectedLocation}</span>
                <span className="text-[11px] font-bold bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full ml-1 no-underline">
                  Change City
                </span>
              </Link>
            </p>

            {/* Prominent Search Bar */}
            <div className="pt-4 max-w-4xl mx-auto">
              <SearchBar />
            </div>

            {/* Quick search tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-600">Popular searches:</span>
              {['Apartments for rent', 'Toyota', 'MacBook', 'Bicycle', 'Handyman', 'Software Engineer', 'Flatmate'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-brand-50 hover:text-brand-700 border border-slate-200/80 text-slate-600 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Explore Categories</h2>
            <p className="text-sm text-slate-500 mt-1">
              Browse through all 8 community marketplace channels
            </p>
          </div>
          <Link
            to="/categories"
            className="text-sm font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 group"
          >
            <span>View all categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.slug === 'forums' ? '/forums' : `/category/${cat.slug}`}
              className="group p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-500/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors shadow-xs">
                  <CategoryIcon name={cat.name} className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {cat.description || `Browse ${cat.name} in ${selectedLocation}`}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-brand-600 group-hover:underline">
                  {cat.children?.length || 0} subcategories
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Listings in Current Location */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-600" />
              <h2 className="text-2xl font-extrabold text-slate-900">Recently Posted</h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Fresh additions in {selectedLocation} and nearby regions
            </p>
          </div>
          <Link
            to={`/search?sort=newest&location=${encodeURIComponent(selectedLocation)}`}
            className="text-sm font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 group"
          >
            <span>See more listings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl border p-4 space-y-3">
                <div className="bg-slate-200 aspect-[4/3] rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-5 bg-slate-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : recentListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-slate-600 text-sm">No recent listings found in this location.</p>
          </div>
        )}
      </section>

      {/* Browse Pillars: Jobs, Housing, For Sale, Services */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Explore by Core Needs
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Whether you are moving, hiring, buying, or looking for local help
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Housing Pillar */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">Housing & Rentals</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Apartments, houses for lease, rooms & roommates, and office space without broker markups.
                </p>
                <ul className="text-xs space-y-2 text-slate-600 mb-6">
                  <li>• Apartments for Rent</li>
                  <li>• Rooms & Shared Sublets</li>
                  <li>• Commercial & Studios</li>
                </ul>
              </div>
              <Link
                to="/category/housing"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Find a place to live →
              </Link>
            </div>

            {/* Jobs Pillar */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">Jobs & Careers</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Direct employment opportunities from local businesses and verified engineering hiring teams.
                </p>
                <ul className="text-xs space-y-2 text-slate-600 mb-6">
                  <li>• Software & Technology</li>
                  <li>• Trades & Skilled Labor</li>
                  <li>• Customer Service & Admin</li>
                </ul>
              </div>
              <Link
                to="/category/jobs"
                className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
              >
                Search open roles →
              </Link>
            </div>

            {/* For Sale Pillar */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">Goods For Sale</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Electronics, furniture, musical gear, bikes, and everyday essentials sold directly by neighbors.
                </p>
                <ul className="text-xs space-y-2 text-slate-600 mb-6">
                  <li>• Electronics & Laptops</li>
                  <li>• Furniture & Home Decor</li>
                  <li>• Bicycles & Sports Gear</li>
                </ul>
              </div>
              <Link
                to="/category/for-sale"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
              >
                Browse for sale items →
              </Link>
            </div>

            {/* Services Pillar */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">Local Services</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Skilled mechanics, home carpenters, cleaners, tutors, and tech repair specialists ready to assist.
                </p>
                <ul className="text-xs space-y-2 text-slate-600 mb-6">
                  <li>• Handyman & Remodeling</li>
                  <li>• Automotive Diagnostics</li>
                  <li>• Tech Support & Tutoring</li>
                </ul>
              </div>
              <Link
                to="/category/services"
                className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1"
              >
                Find trusted pros →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-slate-900 to-navy-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Trust & Community Security</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Designed for safe, local interactions
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Craigslist has always been built on local connections. Our redesign preserves that independence while bringing safety standards, report capabilities, and private in-platform buyer-seller messaging.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/safety"
                  className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-md transition-colors"
                >
                  View Safety Guidelines
                </Link>
                <Link
                  to="/about"
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors"
                >
                  Learn About the Redesign
                </Link>
              </div>
            </div>

            <div className="space-y-4 bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Direct In-App Messaging</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Communicate with buyers and sellers without exposing your personal email or phone number.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Explicit Location Controls</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    We never access your geolocation without explicit permission, and you can switch regions manually at any time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Community Moderation & Reporting</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Flag scams, duplicates, and prohibited items with one click to keep your local board clean.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
