import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Send, AlertCircle, ShieldCheck } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
  sellerId: string;
  sellerName: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  listingId,
  listingTitle,
  sellerId,
  sellerName,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState(
    `Hi ${sellerName}, is this still available? I am interested in "${listingTitle}".`
  );
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (!message.trim()) {
      setError('Please write a message to the seller.');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const res = await api.startConversation({
        listingId,
        recipientId: sellerId,
        initialMessage: message.trim(),
      });

      onClose();
      navigate(`/messages?convo=${res.conversation.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to send message to seller.');
      setIsSending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Contact ${sellerName}`}
      description={`Inquiry regarding "${listingTitle}"`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label
            htmlFor="contact-message"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Your Message
          </label>
          <textarea
            id="contact-message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            placeholder="Introduce yourself and ask questions or arrange a meeting..."
          />
        </div>

        <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-amber-900 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Safety Tip:</strong> Never wire funds, send prepaid gift cards, or pay upfront before inspecting goods in person in a well-lit, public location.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSending}>
            <Send className="w-4 h-4 mr-1.5" />
            Send Message
          </Button>
        </div>
      </form>
    </Modal>
  );
};
