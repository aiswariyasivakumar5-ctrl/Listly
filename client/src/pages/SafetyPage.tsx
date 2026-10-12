import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  MapPin,
  Eye,
  CreditCard,
  PhoneCall,
  Flag,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const SafetyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Trust, Safety & Scam Prevention
        </h1>
        <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          The golden rule of classifieds: <strong>Deal locally, in-person, face-to-face.</strong> Following this single principle eliminates over 99% of fraud attempts.
        </p>
      </div>

      {/* Do's and Don'ts comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DO's */}
        <div className="bg-emerald-50/60 rounded-3xl border border-emerald-200/80 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-lg">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <h3>Safe Practices to Follow</h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-emerald-950 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span><strong>Meet in a public, busy location:</strong> Such as a coffee shop, bank lobby, or police station safe exchange zone.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span><strong>Inspect items thoroughly:</strong> Test electronic gadgets, verify clean vehicle titles, and inspect rental properties in person.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span><strong>Keep communications on platform:</strong> Use our in-app messaging to preserve a record of conversation.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span><strong>Bring a companion:</strong> Whenever visiting a residence or meeting someone for higher-value transactions.</span>
            </li>
          </ul>
        </div>

        {/* DON'Ts */}
        <div className="bg-rose-50/60 rounded-3xl border border-rose-200/80 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-rose-800 font-extrabold text-lg">
            <XCircle className="w-6 h-6 text-rose-600" />
            <h3>Red Flags & What to Avoid</h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-rose-950 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span><strong>NEVER send wire transfers:</strong> Western Union, MoneyGram, Zelle to strangers, or prepaid gift cards (eBay, Apple, etc.).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span><strong>Beware of "too good to be true" prices:</strong> Luxury cars or apartments advertised at half the market rate are usually scams.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span><strong>Refuse cashier check overpayments:</strong> A buyer sends a check for more than the asking price and asks you to refund the remainder.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span><strong>Never pay application fees without seeing the apartment:</strong> Scammers rent out houses they do not own.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* How to Report */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Flag className="w-5 h-5 text-rose-600" />
          How to Flag Suspicious Postings
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Every classified listing on Craigslist Modern includes a Flag icon on the top right. Clicking it allows you to submit a report directly to our moderation team with reasons such as:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 pt-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-medium">
            🚩 Fraud, counterfeit, or scam scheme
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-medium">
            🚩 Prohibited weapons, drugs, or illegal services
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-medium">
            🚩 Spam, unsolicited commercial promotions, or duplicates
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-medium">
            🚩 Harassment, abusive, or discriminatory content
          </div>
        </div>
      </div>
    </div>
  );
};
