import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  Image as ImageIcon,
  X,
  MapPin,
  Tag,
  DollarSign,
  FileText,
  Layers,
  Sparkles,
  AlertCircle,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CategoryIcon } from '../components/ui/CategoryIcon';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { Category } from '../types';

const STEPS = [
  'Category',
  'Title & Info',
  'Price & Attributes',
  'Location',
  'Photos',
  'Review & Publish',
];

const SAMPLE_IMAGES = [
  { label: 'Laptop / Tech', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000' },
  { label: 'Apartment Interior', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000' },
  { label: 'Vehicle / Car', url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1000' },
  { label: 'Furniture / Chair', url: 'https://images.unsplash.com/photo-1580481077195-c26c04f4ec13?w=1000' },
  { label: 'Guitar / Instrument', url: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=1000' },
  { label: 'Bicycle / Sports', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1000' },
];

export const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { selectedLocation } = useLocation();

  const [currentStep, setCurrentStep] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCats, setIsLoadingCats] = useState(true);

  // Form State
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [condition, setCondition] = useState('Like New');
  const [locationName, setLocationName] = useState(selectedLocation);
  const [zipCode, setZipCode] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Category specific attributes
  const [attributes, setAttributes] = useState<Record<string, string>>({});

  useEffect(() => {
    api.getCategories()
      .then((res) => {
        setCategories(res.categories);
        const preselectCatId = searchParams.get('category');
        if (preselectCatId) {
          setSelectedCategoryId(preselectCatId);
          // find parent
          const parent = res.categories.find(
            (c) => c.id === preselectCatId || c.children?.some((sub) => sub.id === preselectCatId)
          );
          if (parent) setSelectedParentId(parent.id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoadingCats(false));
  }, [searchParams]);

  const selectedCategoryObj = categories
    .flatMap((c) => [c, ...(c.children || [])])
    .find((c) => c.id === selectedCategoryId);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be 5MB or less.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const res = await api.uploadImage(file);
      setImages((prev) => [...prev, res.url]);
    } catch (err: any) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSampleImage = (url: string) => {
    if (!images.includes(url)) {
      setImages((prev) => [...prev, url]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateStep = (): boolean => {
    setError(null);
    if (currentStep === 0) {
      if (!selectedCategoryId) {
        setError('Please select a specific category.');
        return false;
      }
    } else if (currentStep === 1) {
      if (!title.trim() || title.trim().length < 5) {
        setError('Title must be at least 5 characters.');
        return false;
      }
      if (!description.trim() || description.trim().length < 10) {
        setError('Description must be at least 10 characters.');
        return false;
      }
    } else if (currentStep === 3) {
      if (!locationName.trim()) {
        setError('Please specify a valid location.');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(STEPS.length - 1, prev + 1));
    }
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setError(null);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        categoryId: selectedCategoryId,
        price: isFree ? 0 : price ? parseFloat(price) : null,
        isNegotiable,
        isFree,
        locationName: locationName.trim(),
        zipCode: zipCode.trim() || undefined,
        condition: condition || undefined,
        attributes,
        images,
      };

      const res = await api.createListing(payload);
      navigate(`/listing/${res.listing.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to publish listing.');
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Post an Advertisement
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Follow our 6-step guided wizard to publish a clear, attractive listing.
        </p>
      </div>

      {/* Wizard Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <div className="flex items-center justify-between">
          {STEPS.map((stepName, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-brand-600 text-white'
                      : isCurrent
                      ? 'border-2 border-brand-600 text-brand-700 bg-brand-50'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-1.5 hidden sm:block ${
                    isCurrent ? 'text-brand-700' : 'text-slate-500'
                  }`}
                >
                  {stepName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        {/* Step 0: Category Selection */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Step 1: Choose a Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedParentId(cat.id);
                    // auto select first child or self
                    if (cat.children && cat.children.length > 0) {
                      setSelectedCategoryId(cat.children[0].id);
                    } else {
                      setSelectedCategoryId(cat.id);
                    }
                  }}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                    selectedParentId === cat.id
                      ? 'border-brand-600 bg-brand-50/70 text-brand-900 ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-brand-600">
                    <CategoryIcon name={cat.name} className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold">{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Subcategory Options */}
            {selectedParentId && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Select Specific Subcategory
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories
                    .find((c) => c.id === selectedParentId)
                    ?.children?.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setSelectedCategoryId(sub.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          selectedCategoryId === sub.id
                            ? 'bg-brand-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Title & Description */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Step 2: Title & Details</h2>
            <Input
              label="Listing Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 2021 Toyota RAV4 Hybrid XLE or Herman Miller Aeron Chair"
              helperText="Be specific. Include brand, model, condition, or size."
              required
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Detailed Description</label>
              <textarea
                rows={7}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your item, job role, or housing offer in detail..."
                className="w-full rounded-2xl border border-slate-300 p-4 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                required
              />
              <p className="text-xs text-slate-400">
                Minimum 10 characters. Avoid posting private phone numbers in public descriptions.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Price & Attributes */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Step 3: Pricing & Specifics</h2>

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
                <label className="block text-sm font-medium text-slate-700 mb-1">Item Condition</label>
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

            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  disabled={isFree}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>Price is negotiable (OBO)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={isFree}
                  onChange={(e) => {
                    setIsFree(e.target.checked);
                    if (e.target.checked) setPrice('0');
                  }}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>This item / service is completely FREE</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Step 4: Location & Neighborhood</h2>
            <Input
              label="City & State"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. San Francisco, CA or Mission District"
              leftIcon={<MapPin className="w-4 h-4" />}
              required
            />
            <Input
              label="ZIP / Postal Code (Optional)"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="e.g. 94110"
              helperText="Helps local buyers calculate distance accurately."
            />
          </div>
        )}

        {/* Step 4: Photos */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 5: Photos & Media</h2>
              <p className="text-xs text-slate-500 mt-1">
                Postings with photos receive up to 5x more responses. Add up to 5 photos.
              </p>
            </div>

            {/* Upload Zone */}
            <div className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-6 text-center transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <label className="cursor-pointer">
                <span className="text-sm font-bold text-brand-600 hover:underline">
                  Upload an image from your device
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
              <p className="text-xs text-slate-400 mt-1">JPEG, PNG, WebP up to 5MB</p>
              {isUploading && <p className="text-xs font-semibold text-brand-600 mt-2">Uploading...</p>}
            </div>

            {/* Quick Sample Photos for Rapid Demonstration */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Or click to add demo image:
              </p>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_IMAGES.map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAddSampleImage(sample.url)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    + {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Uploaded images previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                {images.map((url, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden aspect-[4/3] border group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold bg-brand-600 text-white px-2 py-0.5 rounded">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Review & Publish */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Step 6: Review Your Listing</h2>

            <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-slate-50/50">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="brand">{selectedCategoryObj?.name || 'Category'}</Badge>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">{title}</h3>
                  <p className="text-xs text-slate-500">{locationName}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-slate-900">
                    {isFree ? 'FREE' : price ? `₹${parseFloat(price).toLocaleString('en-IN')}` : 'Contact for price'}
                  </span>
                  {isNegotiable && !isFree && (
                    <span className="text-xs text-slate-500 block">Negotiable</span>
                  )}
                </div>
              </div>

              <div className="text-sm text-slate-700 whitespace-pre-line border-t border-slate-200 pt-3">
                {description}
              </div>

              {images.length > 0 && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <span className="text-xs text-slate-500">{images.length} photos attached:</span>
                  <div className="flex gap-2">
                    {images.map((img, i) => (
                      <img key={i} src={img} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3 text-emerald-900 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                By publishing, this listing will be saved directly to the database and become searchable by local buyers.
              </span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button type="button" variant="primary" onClick={nextStep}>
              Next Step
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={handlePublish}
              isLoading={isPublishing}
              className="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
            >
              <Check className="w-4 h-4 mr-1.5" />
              Publish Listing Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
