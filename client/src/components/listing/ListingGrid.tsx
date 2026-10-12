import React from 'react';
import { Listing } from '../../types';
import { ListingCard } from './ListingCard';
import { EmptyState } from '../ui/EmptyState';

interface ListingGridProps {
  listings: Listing[];
  isLoading?: boolean;
  layout?: 'grid' | 'list';
  emptyTitle?: string;
  emptyDescription?: string;
  onClearFilters?: () => void;
  onFavoriteChange?: (id: string, isFav: boolean) => void;
}

export const ListingGrid: React.FC<ListingGridProps> = ({
  listings,
  isLoading = false,
  layout = 'grid',
  emptyTitle = 'No listings found',
  emptyDescription = 'Try adjusting your search terms, changing the category, or clearing filters.',
  onClearFilters,
  onFavoriteChange,
}) => {
  if (isLoading) {
    return (
      <div
        className={
          layout === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'
            : 'flex flex-col gap-4'
        }
      >
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse bg-white rounded-2xl border border-slate-200/80 overflow-hidden p-3"
          >
            <div className="bg-slate-200 aspect-[4/3] rounded-xl w-full mb-3" />
            <div className="h-4 bg-slate-200 rounded w-2/5 mb-2" />
            <div className="h-5 bg-slate-200 rounded w-4/5 mb-3" />
            <div className="h-3 bg-slate-200 rounded w-3/5" />
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText={onClearFilters ? 'Clear all filters' : undefined}
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div
      className={
        layout === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'
          : 'flex flex-col gap-4'
      }
    >
      {listings.map((item) => (
        <ListingCard
          key={item.id}
          listing={item}
          layout={layout}
          onFavoriteChange={onFavoriteChange}
        />
      ))}
    </div>
  );
};
