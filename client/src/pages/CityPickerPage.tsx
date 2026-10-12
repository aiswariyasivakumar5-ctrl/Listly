import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Search,
  Navigation,
  Check,
  Building2,
  ArrowRight,
  Sparkles,
  Home,
  Briefcase,
  ShoppingBag,
  Wrench,
  Zap,
  Users,
  FileText,
  MessageSquare,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { INDIAN_CITIES, IndianCity } from '../data/indianCities';
import { Button } from '../components/ui/Button';

export const CityPickerPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedLocation, setSelectedLocation, isLocating, locationError, requestGeolocation } =
    useLocation();

  const [query, setQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  // Filter cities based on query and region
  const filteredCities = INDIAN_CITIES.filter((item) => {
    const matchesQuery =
      item.city.toLowerCase().includes(query.toLowerCase()) ||
      item.state.toLowerCase().includes(query.toLowerCase()) ||
      (item.pinCode && item.pinCode.includes(query));

    const matchesRegion =
      selectedRegion === 'All' || item.region === selectedRegion;

    return matchesQuery && matchesRegion;
  });

  const popularCities = INDIAN_CITIES.filter((c) => c.isPopular);

  const handleSelectCity = (city: IndianCity) => {
    const formatted = `${city.city}, ${city.state}`;
    setSelectedLocation(formatted);
    navigate('/marketplace');
  };

  const handleUseMyLocation = async () => {
    const success = await requestGeolocation();
    if (success) {
      navigate('/marketplace');
    }
  };

  const regions = ['All', 'South', 'West', 'North', 'East', 'Central'];

  const coreFeatures = [
    {
      title: 'Housing',
      desc: 'Apartments for rent, rooms, sublets, vacation rentals, real estate for sale',
      icon: Home,
      slug: 'housing',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Jobs',
      desc: 'Full-time, part-time and contract roles across many industries',
      icon: Briefcase,
      slug: 'jobs',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'For Sale',
      desc: 'Used goods like furniture, electronics, vehicles, appliances and collectibles',
      icon: ShoppingBag,
      slug: 'for-sale',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Services',
      desc: 'Things like movers, tutors, repair, beauty and computer help',
      icon: Wrench,
      slug: 'services',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      title: 'Gigs',
      desc: 'Short-term or one-off paid tasks and freelance missions',
      icon: Zap,
      slug: 'gigs',
      color: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    {
      title: 'Community',
      desc: 'Events, activities, lost and found, groups, local news',
      icon: Users,
      slug: 'community',
      color: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      title: 'Resumes',
      desc: 'Job seekers posting their profiles for employers to find',
      icon: FileText,
      slug: 'resumes',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      title: 'Discussion Forums',
      desc: 'Topic-based message boards for advice, local chat and recommendations',
      icon: MessageSquare,
      slug: 'forums',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Standalone Brand Header: Only Logo and Name */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo: Strictly only icon and name */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-brand-600/25">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              Listly
            </span>
          </div>

          {/* Quick jump to marketplace if city already active */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/marketplace')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/90 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span>Current: <strong className="text-slate-900">{selectedLocation}</strong></span>
              <span className="text-brand-600 font-bold ml-1">Enter →</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main City Picker Body */}
      <main className="flex-grow space-y-12 pb-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-slate-50 to-slate-50 pt-12 pb-14 border-b border-slate-200/70">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/90 border border-brand-200 text-brand-800 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>India Local Classified Marketplace</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Where are you located?
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Select your city to browse local housing, jobs, for sale items, services, gigs,
              and community message boards in your area.
            </p>

            {/* Prominent Search Bar & GPS Button */}
            <div className="max-w-2xl mx-auto space-y-3 pt-2">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search city, state (e.g. Bengaluru, Mumbai, Delhi, Pune, Chennai) or PIN code..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-base font-medium focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 shadow-sm transition-all"
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded-md"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  disabled={isLocating}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-brand-50 border border-slate-200 text-slate-700 hover:text-brand-700 font-semibold transition-colors cursor-pointer"
                >
                  <Navigation className={`w-3.5 h-3.5 text-brand-600 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Detecting your city...' : 'Use Browser Geolocation (GPS)'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <span>Active City:</span>
                  <span className="font-bold text-slate-800 bg-slate-200/80 px-2 py-0.5 rounded-md">
                    {selectedLocation}
                  </span>
                </div>
              </div>

              {locationError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-left">
                  {locationError}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* City Selection Directory */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Major Indian Metros */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-600" />
                <span>Popular Indian Metro Markets</span>
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                Click any city to enter
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {popularCities.map((city) => {
                const formatted = `${city.city}, ${city.state}`;
                const isCurrent = selectedLocation === formatted;

                return (
                  <button
                    key={city.city}
                    type="button"
                    onClick={() => handleSelectCity(city)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group cursor-pointer ${
                      isCurrent
                        ? 'border-brand-500 bg-brand-50/80 shadow-md ring-2 ring-brand-500/20'
                        : 'border-slate-200/90 bg-white hover:border-brand-400 hover:shadow-md hover:-translate-y-0.5'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="font-extrabold text-base text-slate-900 group-hover:text-brand-600 transition-colors">
                          {city.city}
                        </span>
                        {isCurrent && (
                          <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 block">{city.state}</span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-brand-600">
                      <span className="font-semibold">{city.region} Region</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Regional Directory */}
          <section className="space-y-6 pt-4 border-t border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  All Cities by Region
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing {filteredCities.length} {filteredCities.length === 1 ? 'city' : 'cities'}
                </p>
              </div>

              {/* Region Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-semibold">
                {regions.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => setSelectedRegion(region)}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      selectedRegion === region
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {region} {region !== 'All' ? 'India' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtered Cities Grid */}
            {filteredCities.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {filteredCities.map((item) => {
                  const formatted = `${item.city}, ${item.state}`;
                  const isCurrent = selectedLocation === formatted;

                  return (
                    <button
                      key={item.city}
                      type="button"
                      onClick={() => handleSelectCity(item)}
                      className={`p-3 rounded-xl border text-left transition-all text-xs flex flex-col justify-between cursor-pointer ${
                        isCurrent
                          ? 'border-brand-500 bg-brand-50 text-brand-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-brand-400 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-bold text-slate-900 text-sm truncate block">
                        {item.city}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.state}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-sm text-slate-500 space-y-2">
                <p className="font-semibold text-slate-700">No Indian cities found matching "{query}"</p>
                <p className="text-xs text-slate-400">Try searching for state names or reset filters.</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setQuery('');
                    setSelectedRegion('All');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </section>

          {/* 8 Features Preview */}
          <section className="space-y-6 pt-6 border-t border-slate-200/80">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl font-black text-slate-900">
                Explore the 8 Community Pillars
              </h2>
              <p className="text-sm text-slate-500">
                Once you select your city, you'll unlock verified local channels across India
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {coreFeatures.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    onClick={() => {
                      navigate(feat.slug === 'forums' ? '/forums' : `/category/${feat.slug}`);
                    }}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-brand-400 hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${feat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors">
                          {feat.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {feat.desc}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-600">
                      <span>Browse in {selectedLocation.split(',')[0]}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {/* Minimal Footer for City Picker */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Listly Classifieds. Built for local communities across India.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Housing</span>
            <span>•</span>
            <span>Jobs</span>
            <span>•</span>
            <span>For Sale</span>
            <span>•</span>
            <span>Services</span>
            <span>•</span>
            <span>Discussion Forums</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CityPickerPage;
