import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Clock, Eye, Sparkles } from 'lucide-react';
import { Listing } from '../../types';
import { Badge } from '../ui/Badge';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface ListingCardProps {
  listing: Listing;
  layout?: 'grid' | 'list';
  onFavoriteChange?: (listingId: string, isFavorited: boolean) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  layout = 'grid',
  onFavoriteChange,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(listing.isFavorited || false);
  const [favoriteCount, setFavoriteCount] = useState(listing.favoriteCount || 0);
  const [isTogglingFav, setIsTogglingFav] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (isTogglingFav) return;
    setIsTogglingFav(true);

    try {
      if (isFavorited) {
        await api.removeFavorite(listing.id);
        setIsFavorited(false);
        setFavoriteCount((prev) => Math.max(0, prev - 1));
        onFavoriteChange?.(listing.id, false);
      } else {
        await api.addFavorite(listing.id);
        setIsFavorited(true);
        setFavoriteCount((prev) => prev + 1);
        onFavoriteChange?.(listing.id, true);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    } finally {
      setIsTogglingFav(false);
    }
  };

  const formatPrice = () => {
    if (listing.isFree) {
      return <span className="text-emerald-600 font-bold">FREE</span>;
    }
    if (listing.price !== null && listing.price !== undefined) {
      return (
        <span className="text-slate-900 font-extrabold text-lg">
          ₹{listing.price.toLocaleString('en-IN')}
          {listing.isNegotiable && (
            <span className="text-xs font-normal text-slate-500 ml-1">OBO</span>
          )}
        </span>
      );
    }
    return <span className="text-slate-600 font-semibold text-sm">Contact for price</span>;
  };

  const getRelativeTime = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  const coverImage = listing.images?.[0]?.url;

  // Category specific attribute tags
  const renderAttrSummary = () => {
    if (!listing.attributes) return null;
    try {
      const attrs = JSON.parse(listing.attributes);
      const tags: string[] = [];
      if (attrs.bedrooms) tags.push(`${attrs.bedrooms} Bed`);
      if (attrs.bathrooms) tags.push(`${attrs.bathrooms} Bath`);
      if (attrs.year) tags.push(String(attrs.year));
      if (attrs.mileage) tags.push(`${(attrs.mileage / 1000).toFixed(0)}k mi`);
      if (attrs.jobType) tags.push(attrs.jobType);
      if (attrs.brand) tags.push(attrs.brand);

      if (tags.length === 0) return null;

      return (
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      );
    } catch {
      return null;
    }
  };

  if (layout === 'list') {
    return (
      <Link
        to={`/listing/${listing.id}`}
        className="group flex flex-col sm:flex-row bg-white rounded-2xl border border-slate-200/80 hover:border-brand-500/50 hover:shadow-md transition-all duration-200 overflow-hidden"
      >
        <div className="relative sm:w-60 h-44 sm:h-auto shrink-0 bg-slate-100 overflow-hidden">
          {coverImage ? (
            <img
              src={coverImage}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4">
              <Sparkles className="w-8 h-8 mb-1 text-slate-300" />
              <span className="text-xs">No photos provided</span>
            </div>
          )}
          {listing.condition && (
            <div className="absolute top-2.5 left-2.5">
              <Badge variant="brand" size="sm">
                {listing.condition}
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="slate" size="sm">
                  {listing.category?.name || 'General'}
                </Badge>
                {listing.status === 'SOLD' && (
                  <Badge variant="rose" size="sm">
                    SOLD
                  </Badge>
                )}
              </div>
              <button
                type="button"
                onClick={handleFavoriteClick}
                className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                aria-label="Save listing"
              >
                <Heart
                  className={`w-5 h-5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`}
                />
              </button>
            </div>

            <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors mt-2 line-clamp-1">
              {listing.title}
            </h3>

            <p className="text-sm text-slate-500 line-clamp-2 mt-1 leading-relaxed">
              {listing.description}
            </p>

            {renderAttrSummary()}
          </div>

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
            <div>{formatPrice()}</div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {listing.locationName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {getRelativeTime(listing.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view card
  return (
    <Link
      to={`/listing/${listing.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 hover:border-brand-500/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
    >
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4">
            <Sparkles className="w-8 h-8 mb-1 text-slate-300" />
            <span className="text-xs">No photos</span>
          </div>
        )}

        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {listing.condition && (
            <Badge variant="brand" size="sm" className="bg-white/90 backdrop-blur-sm shadow-xs">
              {listing.condition}
            </Badge>
          )}
          {listing.status === 'SOLD' && (
            <Badge variant="rose" size="sm" className="bg-white/90 backdrop-blur-sm">
              SOLD
            </Badge>
          )}
        </div>

        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-rose-500 shadow-sm backdrop-blur-sm transition-all"
          aria-label="Save listing"
        >
          <Heart
            className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`}
          />
        </button>
      </div>

      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <div>{formatPrice()}</div>
            <span className="text-[11px] font-medium text-slate-400">
              {getRelativeTime(listing.createdAt)}
            </span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
            {listing.title}
          </h3>

          {renderAttrSummary()}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 mt-3 border-t border-slate-100">
          <span className="flex items-center gap-1 truncate max-w-[180px]">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{listing.locationName}</span>
          </span>
          <span className="text-slate-400 text-[11px] shrink-0 font-medium">
            {listing.category?.name}
          </span>
        </div>
      </div>
    </Link>
  );
};
