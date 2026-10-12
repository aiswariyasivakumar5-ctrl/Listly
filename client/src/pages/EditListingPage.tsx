import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save, Trash2, ArrowLeft, AlertCircle, CheckCircle, Eye } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Listing } from '../types';

export const EditListingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'SOLD' | 'INACTIVE'>('ACTIVE');
  const [condition, setCondition] = useState('Good');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchListing = async () => {
      try {
        setIsLoading(true);
        const res = await api.getListing(id);
        const l = res.listing;
        setListing(l);
        setTitle(l.title);
        setDescription(l.description);
        setPrice(l.price !== null && l.price !== undefined ? String(l.price) : '');
        setIsNegotiable(Boolean(l.isNegotiable));
        setIsFree(Boolean(l.isFree));
        setLocationName(l.locationName);
        setStatus(l.status);
        setCondition(l.condition || 'Good');
      } catch (err: any) {
        setError(err.message || 'Failed to load listing.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await api.updateListing(id, {
        title: title.trim(),
        description: description.trim(),
        price: isFree ? 0 : price ? parseFloat(price) : null,
        isNegotiable,
        isFree,
        locationName: locationName.trim(),
        status,
        condition,
      });

      setSuccess(true);
      setTimeout(() => navigate(`/listing/${id}`), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update listing.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await api.deleteListing(id);
      navigate('/dashboard/listings');
    } catch (err: any) {
      setError(err.message || 'Failed to delete listing.');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-3xl mx-auto py-20 text-center text-slate-500">Loading listing details...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <Link
          to={`/listing/${id}`}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listing View
        </Link>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 p-2 rounded-lg hover:bg-rose-50"
        >
          <Trash2 className="w-4 h-4" />
          Delete Listing
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Edit Listing</h1>
        <p className="text-sm text-slate-500 mt-1">
          Update prices, availability status, and details for your posting.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2.5">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
          <span>Listing updated successfully! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Posting Status</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'ACTIVE', label: 'Active / Available' },
              { id: 'SOLD', label: 'Mark as Sold' },
              { id: 'INACTIVE', label: 'Draft / Inactive' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatus(st.id as any)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors ${
                  status === st.id
                    ? 'border-brand-600 bg-brand-50 text-brand-800 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 p-4 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Asking Price (₹)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                min="0"
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isFree}
                placeholder="0"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm disabled:bg-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm"
            >
              <option value="New">Brand New</option>
              <option value="Like New">Like New</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>
        </div>

        <Input
          label="Location Name"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          required
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link to={`/listing/${id}`}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="primary" isLoading={isSaving}>
            <Save className="w-4 h-4 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete this listing?"
        description="Are you sure you want to permanently remove this posting? This action cannot be undone."
      >
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Keep Listing
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
            Yes, Permanently Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};
