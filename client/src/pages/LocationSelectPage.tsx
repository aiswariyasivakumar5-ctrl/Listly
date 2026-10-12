import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Search,
  Navigation,
  Check,
  AlertCircle,
  Building,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { api } from '../services/api';
import { LocationItem } from '../types';
import { Button } from '../components/ui/Button';

export const LocationSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedLocation, setSelectedLocation, isLocating, locationError, requestGeolocation } =
    useLocation();

  const [query, setQuery] = useState('');
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [popularLocations, setPopularLocations] = useState<LocationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionPrompted, setPermissionPrompted] = useState(false);

  useEffect(() => {
    // Load popular locations
    api.getPopularLocations()
      .then((res) => setPopularLocations(res.locations))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      try {
        setIsLoading(true);
        const res = await api.searchLocations(query);
        setLocations(res.locations);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleSelect = (loc: LocationItem) => {
    const formatted = `${loc.city}, ${loc.state}`;
    setSelectedLocation(formatted);
    navigate('/');
  };

  const handleUseMyLocation = async () => {
    setPermissionPrompted(true);
    const success = await requestGeolocation();
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Select Your Marketplace Location
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          Bazaar is built around local communities. Pick your city or metro region across India to see relevant postings, rentals, jobs, and items for sale near you.
        </p>
      </div>

      {/* Currently Selected Location Banner */}
      <div className="bg-brand-50 border border-brand-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              Active Region
            </span>
            <h3 className="text-lg font-bold text-slate-900">{selectedLocation}</h3>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>
          Browse {selectedLocation} →
        </Button>
      </div>

      {/* Geolocation Explicit Request Button */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-brand-600" />
              Use Browser Geolocation
            </h4>
            <p className="text-xs text-slate-500 max-w-lg">
              We only check your location with your explicit permission to identify the nearest classifieds board. Your exact GPS coordinates are never stored or shared.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleUseMyLocation}
            isLoading={isLocating}
            className="shrink-0 font-medium"
          >
            Locate Nearest Region
          </Button>
        </div>

        {locationError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{locationError}</span>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city, state (e.g. Bengaluru, Mumbai, Delhi, Pune, Chennai) or PIN code..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-sm"
          />
        </div>

        {/* Search Results List */}
        {query.trim().length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
            <div className="p-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Search Results
            </div>
            {isLoading ? (
              <div className="p-6 text-center text-sm text-slate-400">Searching regions...</div>
            ) : locations.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {locations.map((loc) => {
                  const formatted = `${loc.city}, ${loc.state}`;
                  const isCurrent = selectedLocation === formatted;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => handleSelect(loc)}
                      className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Building className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {loc.city}, {loc.state}
                          </p>
                          <p className="text-xs text-slate-400">
                            {loc.metro} {loc.zipCode ? `• ZIP ${loc.zipCode}` : ''}
                          </p>
                        </div>
                      </div>
                      {isCurrent ? (
                        <span className="text-xs font-semibold text-brand-600 flex items-center gap-1 bg-brand-50 px-2 py-1 rounded-md">
                          <Check className="w-3.5 h-3.5" />
                          Selected
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 group-hover:text-brand-600">
                          Select →
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-slate-500">
                No marketplace regions matching "{query}". Try searching by state code or major metro.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Major Metro Regions Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">Major Metro Markets</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {popularLocations.map((loc) => {
            const formatted = `${loc.city}, ${loc.state}`;
            const isCurrent = selectedLocation === formatted;
            return (
              <button
                key={loc.id}
                onClick={() => handleSelect(loc)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'border-brand-500 bg-brand-50/60 shadow-xs ring-1 ring-brand-500'
                    : 'border-slate-200 bg-white hover:border-brand-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <p className="font-bold text-sm text-slate-900">{loc.city}</p>
                  <p className="text-xs text-slate-400">{loc.metro}</p>
                </div>
                {isCurrent && (
                  <span className="text-[11px] font-semibold text-brand-700 mt-2 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
