import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, SearchX, ArrowRight, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import { Listing } from '../types';
import { ListingGrid } from '../components/listing/ListingGrid';
import { Button } from '../components/ui/Button';

export const SavedListingsPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const res = await api.getFavorites();
      setFavorites(res.listings);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteChange = (listingId: string, isFav: boolean) => {
    if (!isFav) {
      setFavorites((prev) => prev.filter((l) => l.id !== listingId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Saved Listings
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Keep track of apartments, vehicles, and items you are considering.
          </p>
        </div>
        <Link to="/search">
          <Button variant="outline">
            Browse More Listings
          </Button>
        </Link>
      </div>

      <ListingGrid
        listings={favorites}
        isLoading={isLoading}
        layout="grid"
        emptyTitle="No saved listings yet"
        emptyDescription="When you find an item you are interested in, click the heart icon on its card to save it here."
        onFavoriteChange={handleFavoriteChange}
      />
    </div>
  );
};
