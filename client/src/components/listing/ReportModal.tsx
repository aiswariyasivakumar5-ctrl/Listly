import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { api } from '../../services/api';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
}

const REPORT_REASONS = [
  'Fraud, scam, or counterfeit item',
  'Misleading or inaccurate information',
  'Prohibited or illegal goods / services',
  'Spam or duplicate listing',
  'Offensive, abusive, or inappropriate content',
  'Item is no longer available',
  'Other issue',
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  listingId,
  listingTitle,
}) => {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await api.submitReport({
        listingId,
        reason: selectedReason,
        details,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setDetails('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Report this listing"
      description={`Help keep our community secure. Reporting: "${listingTitle}"`}
    >
      {submitted ? (
        <div className="py-6 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900">Report Received</h4>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            Thank you for bringing this to our attention. Our trust and safety team will review the listing promptly.
          </p>
          <div className="pt-3">
            <Button variant="primary" onClick={handleClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Reason for reporting
            </label>
            <div className="space-y-2">
              {REPORT_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border text-sm cursor-pointer transition-colors ${
                    selectedReason === reason
                      ? 'border-brand-500 bg-brand-50/50 text-brand-900 font-medium'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="text-brand-600 focus:ring-brand-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="report-details"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
            >
              Additional details (optional)
            </label>
            <textarea
              id="report-details"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide context or evidence to help our safety team..."
              className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" isLoading={isSubmitting}>
              Submit Report
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
