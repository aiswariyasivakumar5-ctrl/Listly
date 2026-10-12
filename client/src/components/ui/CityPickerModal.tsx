import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Navigation,
  Check,
  X,
  Compass,
  Building2,
  Sparkles,
} from 'lucide-react';
import { INDIAN_CITIES, IndianCity } from '../../data/indianCities';
import { useLocation } from '../../context/LocationContext';

interface CityPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CityPickerModal: React.FC<CityPickerModalProps> = ({ isOpen, onClose }) => {
  const { selectedLocation, setSelectedLocation, isLocating, requestGeolocation, locationError } =
    useLocation();

  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  if (!isOpen) return null;

  const popularCities = INDIAN_CITIES.filter((c) => c.isPopular);

  const filteredCities = INDIAN_CITIES.filter((c) => {
    const matchesSearch =
      !search.trim() ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.state.toLowerCase().includes(search.toLowerCase()) ||
      (c.pinCode && c.pinCode.includes(search));

    const matchesRegion = selectedRegion === 'All' || c.region === selectedRegion;

    return matchesSearch && matchesRegion;
  });

  const handleSelectCity = (c: IndianCity) => {
    const formatted = `${c.city}, ${c.state}`;
    setSelectedLocation(formatted);
    onClose();
  };

  const handleUseLocation = async () => {
    const success = await requestGeolocation();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal Dialog */}
        <div className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white p-6 text-left shadow-2xl transition-all relative z-10 border border-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Select City</h3>
                <p className="text-xs text-slate-500">Pick your local marketplace in India</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & GPS bar */}
          <div className="space-y-3 mb-5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by city (e.g. Bengaluru, Mumbai, Delhi) or state..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                autoFocus
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Geolocation shortcut */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-brand-600" />
                <span className="text-xs text-slate-700 font-medium">
                  Currently active: <strong className="text-slate-900">{selectedLocation}</strong>
                </span>
              </div>
              <button
                onClick={handleUseLocation}
                disabled={isLocating}
                className="text-xs font-bold text-brand-600 hover:text-brand-800 disabled:opacity-50 flex items-center gap-1"
              >
                {isLocating ? 'Detecting...' : 'Detect Nearest City'}
              </button>
            </div>

            {locationError && (
              <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2 rounded-lg">
                {locationError}
              </p>
            )}
          </div>

          {/* Popular Cities Quick Pills */}
          {!search && (
            <div className="mb-5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Popular Metros
              </span>
              <div className="flex flex-wrap gap-2">
                {popularCities.map((c) => {
                  const isCurrent = selectedLocation.startsWith(c.city);
                  return (
                    <button
                      key={c.city}
                      onClick={() => handleSelectCity(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isCurrent
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:border-brand-400 hover:bg-slate-50'
                      }`}
                    >
                      <span>{c.city}</span>
                      {isCurrent && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Region Tabs */}
          {!search && (
            <div className="flex gap-1.5 border-b border-slate-100 pb-2 mb-3 overflow-x-auto text-xs">
              {['All', 'South', 'West', 'North', 'East', 'Central'].map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                    selectedRegion === reg
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          )}

          {/* Cities Grid */}
          <div className="max-h-64 overflow-y-auto pr-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredCities.map((c) => {
                const formatted = `${c.city}, ${c.state}`;
                const isCurrent = selectedLocation === formatted;
                return (
                  <button
                    key={`${c.city}-${c.state}`}
                    onClick={() => handleSelectCity(c)}
                    className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'border-brand-500 bg-brand-50/70 ring-1 ring-brand-500'
                        : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{c.city}</p>
                      <p className="text-[11px] text-slate-400 truncate">{c.state}</p>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-brand-600 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>

            {filteredCities.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                No Indian cities matching "{search}". Try searching for the state or a nearby major metro.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
