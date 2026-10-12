import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  Eye,
  Heart,
  Edit,
  Trash2,
  CheckCircle,
  ExternalLink,
  Clock,
  MapPin,
} from 'lucide-react';
import { api } from '../services/api';
import { Listing } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

export const MyListingsPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const res = await api.getMyListings();
      setListings(res.listings);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleToggleSold = async (item: Listing) => {
    const nextStatus = item.status === 'SOLD' ? 'ACTIVE' : 'SOLD';
    try {
      await api.updateListing(item.id, { status: nextStatus });
      setListings((prev) =>
        prev.map((l) => (l.id === item.id ? { ...l, status: nextStatus as any } : l))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteListing(deleteTarget.id);
      setListings((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = listings.filter((item) => {
    if (filterStatus === 'ALL') return true;
    return item.status === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage My Listings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track views, edit details, toggle sold status, and remove inactive postings.
          </p>
        </div>
        <Link to="/post">
          <Button variant="primary">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Post New Ad
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'ALL', label: `All (${listings.length})` },
          { id: 'ACTIVE', label: `Active (${listings.filter((l) => l.status === 'ACTIVE').length})` },
          { id: 'SOLD', label: `Sold (${listings.filter((l) => l.status === 'SOLD').length})` },
          { id: 'INACTIVE', label: `Inactive (${listings.filter((l) => l.status === 'INACTIVE').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterStatus === tab.id
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Listings List */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400">Loading your listings...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No postings in this status</h3>
          <p className="text-sm text-slate-500">
            You do not have any listings matching "{filterStatus.toLowerCase()}".
          </p>
          <Link to="/post">
            <Button variant="outline">Create a new post</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200'}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        item.status === 'ACTIVE'
                          ? 'brand'
                          : item.status === 'SOLD'
                          ? 'rose'
                          : 'slate'
                      }
                      size="sm"
                    >
                      {item.status}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-400">
                      {item.category?.name}
                    </span>
                  </div>

                  <Link
                    to={`/listing/${item.id}`}
                    className="text-base font-bold text-slate-900 hover:text-brand-600 truncate block mt-1"
                  >
                    {item.title}
                  </Link>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="font-extrabold text-slate-800">
                      {item.isFree ? 'FREE' : item.price ? `₹${item.price.toLocaleString('en-IN')}` : 'No price'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {item.locationName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {item.views} views
                    </span>
                    <span>
                      Posted {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => handleToggleSold(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                    item.status === 'SOLD'
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {item.status === 'SOLD' ? 'Re-activate' : 'Mark as Sold'}
                </button>

                <Link to={`/edit-listing/${item.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>
                </Link>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Posting?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"?`}
      >
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};
