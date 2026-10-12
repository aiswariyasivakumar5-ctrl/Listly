import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Share2,
  Flag,
  MapPin,
  Clock,
  Eye,
  ShieldAlert,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  User,
  Sparkles,
  AlertCircle,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ContactModal } from '../components/listing/ContactModal';
import { ReportModal } from '../components/listing/ReportModal';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Listing, ListingImage } from '../types';

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState<Listing | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  // Modals
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchListing = async () => {
      try {
        setIsLoading(true);
        const res = await api.getListing(id);
        setListing(res.listing);
        setIsFavorited(Boolean(res.listing.isFavorited));
        setFavoriteCount(res.listing.favoriteCount || 0);
      } catch (err) {
        console.error('Failed to load listing:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    if (!listing) return;

    try {
      if (isFavorited) {
        await api.removeFavorite(listing.id);
        setIsFavorited(false);
        setFavoriteCount((prev) => Math.max(0, prev - 1));
      } else {
        await api.addFavorite(listing.id);
        setIsFavorited(true);
        setFavoriteCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="h-8 bg-slate-200 rounded w-2/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 h-96 bg-slate-200 rounded-2xl" />
          <div className="h-64 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Listing Not Found</h2>
        <p className="text-sm text-slate-500">
          This posting may have been removed, sold, or expired.
        </p>
        <Link to="/search">
          <Button variant="primary">Browse More Listings</Button>
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === listing.ownerId;
  const images = listing.images || [];
  const currentImage = images[activeImageIndex]?.url;

  // Parse category attributes
  let parsedAttrs: Record<string, any> = {};
  if (listing.attributes) {
    try {
      parsedAttrs = JSON.parse(listing.attributes);
    } catch {
      // Ignore
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link to={`/category/${listing.category?.slug}`} className="hover:text-brand-600">
          {listing.category?.name}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-sm">{listing.title}</span>
      </nav>

      {/* Title & Action Strip */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">{listing.category?.name}</Badge>
            {listing.condition && <Badge variant="slate">{listing.condition}</Badge>}
            {listing.status === 'SOLD' && <Badge variant="rose">SOLD</Badge>}
            <span className="text-xs text-slate-400 flex items-center gap-1 ml-2">
              <Clock className="w-3.5 h-3.5" />
              Posted {new Date(listing.createdAt).toLocaleDateString()}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {listing.views} views
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
            {listing.title}
          </h1>

          <p className="text-sm text-slate-500 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand-600" />
            <span>{listing.locationName}</span>
            {listing.zipCode && <span className="text-slate-400">• ZIP {listing.zipCode}</span>}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleFavoriteToggle}
            className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
              isFavorited
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Save to favorites"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isFavorited ? 'Saved' : 'Save'}</span>
            {favoriteCount > 0 && <span className="text-slate-400">({favoriteCount})</span>}
          </button>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors relative"
            title="Copy link"
          >
            <Share2 className="w-4 h-4 text-slate-500" />
            <span>{shareCopied ? 'Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={() => setIsReportOpen(true)}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-400 text-xs font-semibold transition-colors"
            title="Report this listing"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Images & Full Description */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery Preview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
            <div className="relative aspect-[16/10] bg-slate-900 flex items-center justify-center">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={listing.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center text-slate-400 p-8 space-y-2">
                  <Sparkles className="w-12 h-12 text-slate-500 mx-auto" />
                  <p className="text-sm">No photos provided by seller</p>
                </div>
              )}

              {/* Prev / Next controls */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3 overflow-x-auto">
                {images.map((img: ListingImage, idx: number) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-brand-600 scale-105 shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Attributes Grid */}
          {Object.keys(parsedAttrs).length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Listing Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(parsedAttrs).map(([key, value]) => (
                  <div key={key} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">
                      {String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Description</h3>
            <div className="text-slate-700 leading-relaxed text-sm whitespace-pre-line font-normal">
              {listing.description}
            </div>
          </div>

          {/* Safety Guidelines Warning */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 flex items-start gap-3.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <h4 className="font-bold text-sm text-amber-950">Safety Checklist for Classifieds</h4>
              <p className="leading-relaxed">
                • Always meet in a public, well-lit place (e.g. police station parking lot, cafe).<br />
                • Do NOT send wire transfers, Western Union, cashier checks, or gift cards.<br />
                • Verify and test item in person prior to transferring payment.
              </p>
              <Link to="/safety" className="text-amber-800 underline font-semibold block pt-1">
                Read our full marketplace scam prevention guide →
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Seller Profile & Contact Box */}
        <div className="space-y-6">
          {/* Price & Primary CTA Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6 sticky top-24">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Price
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                {listing.isFree ? (
                  <span className="text-3xl font-extrabold text-emerald-600">FREE</span>
                ) : listing.price !== null && listing.price !== undefined ? (
                  <>
                    <span className="text-3xl font-extrabold text-slate-900">
                      ₹{listing.price.toLocaleString('en-IN')}
                    </span>
                    {listing.isNegotiable && (
                      <span className="text-xs text-slate-500 font-medium">(Negotiable)</span>
                    )}
                  </>
                ) : (
                  <span className="text-xl font-bold text-slate-700">Contact for pricing</span>
                )}
              </div>
            </div>

            {/* Contact CTA */}
            {isOwner ? (
              <div className="space-y-2">
                <Link to={`/edit-listing/${listing.id}`}>
                  <Button variant="outline" className="w-full">
                    Edit Your Listing
                  </Button>
                </Link>
                <p className="text-xs text-center text-slate-400">
                  You are the owner of this classified post.
                </p>
              </div>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="w-full shadow-md"
                onClick={() => setIsContactOpen(true)}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Contact Seller
              </Button>
            )}

            {/* Seller Information Card */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                About the Seller
              </h4>
              <div className="flex items-center gap-3">
                {listing.owner?.avatarUrl ? (
                  <img
                    src={listing.owner.avatarUrl}
                    alt={listing.owner.displayName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                    <User className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">
                    {listing.owner?.displayName || 'Marketplace Seller'}
                  </h5>
                  <p className="text-xs text-slate-400">
                    Member since {new Date(listing.owner?.createdAt || listing.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {listing.owner?.bio && (
                <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                  "{listing.owner.bio}"
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Active Listings:</span>
                <span className="font-bold text-slate-800">
                  {listing.owner?._count?.listings || 1}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {listing && (
        <ContactModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          listingId={listing.id}
          listingTitle={listing.title}
          sellerId={listing.owner.id}
          sellerName={listing.owner.displayName}
        />
      )}

      {/* Report Modal */}
      {listing && (
        <ReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          listingId={listing.id}
          listingTitle={listing.title}
        />
      )}
    </div>
  );
};
